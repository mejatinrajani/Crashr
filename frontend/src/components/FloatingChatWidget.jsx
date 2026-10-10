
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Minus,
  Search,
  ArrowLeft,
  Send,
  LoaderCircle,
  PartyPopper,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';


const FloatingChatWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messageError, setMessageError] = useState('');

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const activeConversationRef = useRef(null);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Load the user's conversations and their latest messages.
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');

    try {
      const { data, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          id,
          party_id,
          host_id,
          guest_id,
          created_at,
          party:parties!conversations_party_id_fkey (
            id,
            title,
            cover_image_url
          ),
          host:profiles!conversations_host_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          guest:profiles!conversations_guest_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`);

      if (conversationError) throw conversationError;

      const rows = data || [];

      if (rows.length === 0) {
        setConversations([]);
        setActiveConversation(null);
        setMessages([]);
        return;
      }

      const { data: recentMessages, error: recentError } =
        await supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, created_at')
          .in('conversation_id', rows.map((item) => item.id))
          .order('created_at', { ascending: false });

      if (recentError) throw recentError;

      const latestByConversation = new Map();

      (recentMessages || []).forEach((message) => {
        if (!latestByConversation.has(message.conversation_id)) {
          latestByConversation.set(message.conversation_id, message);
        }
      });

      const normalized = rows
        .map((conversation) => {
          const isHost = conversation.host_id === user.id;

          return {
            ...conversation,
            otherPerson: isHost
              ? conversation.guest
              : conversation.host,
            party: conversation.party,
            latestMessage:
              latestByConversation.get(conversation.id) || null,
          };
        })
        .sort((a, b) => {
          const timeA = new Date(
            a.latestMessage?.created_at || a.created_at
          ).getTime();

          const timeB = new Date(
            b.latestMessage?.created_at || b.created_at
          ).getTime();

          return timeB - timeA;
        });

      setConversations(normalized);

      // Keep the selected conversation synchronized with refreshed data.
      const current = activeConversationRef.current;

      if (current) {
        const refreshed = normalized.find(
          (item) => item.id === current.id
        );

        if (refreshed) {
          setActiveConversation(refreshed);
        } else {
          setActiveConversation(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Unable to load conversations:', err);
      setError(
        err.message || 'Unable to load conversations. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
    }
  }, [user?.id, loadConversations]);

  // Load chat history and subscribe to new messages for the selected chat.
  useEffect(() => {
    if (!activeConversation?.id || !user?.id) {
      setMessages([]);
      setMessageError('');
      return undefined;
    }

    const conversationId = activeConversation.id;
    let cancelled = false;

    const loadHistory = async () => {
      setLoadingMessages(true);
      setMessageError('');

      const { data, error: historyError } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (historyError) {
        console.error('Unable to load chat history:', historyError);
        setMessageError('Could not load messages. Please try again.');
      } else {
        setMessages(data || []);
      }

      setLoadingMessages(false);
    };

    loadHistory();

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new;

          setMessages((current) => {
            if (current.some((item) => item.id === incoming.id)) {
              return current;
            }

            return [...current, incoming].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
          });

          setConversations((current) =>
            current
              .map((conversation) =>
                conversation.id === conversationId
                  ? { ...conversation, latestMessage: incoming }
                  : conversation
              )
              .sort((a, b) => {
                const timeA = new Date(
                  a.latestMessage?.created_at || a.created_at
                ).getTime();

                const timeB = new Date(
                  b.latestMessage?.created_at || b.created_at
                ).getTime();

                return timeB - timeA;
              })
          );
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('Chat Realtime subscription status:', status);
        }
      });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [activeConversation?.id, user?.id]);

  // Keep the latest message visible.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingMessages]);

  const openConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessages([]);
    setMessageText('');
    setMessageError('');
  };

  const closeConversation = () => {
    setActiveConversation(null);
    setMessages([]);
    setMessageText('');
    setMessageError('');
  };

  const closeWidget = () => {
    setIsOpen(false);
    closeConversation();
  };

  // Insert into the existing messages table.
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = messageText.trim();

    if (
      !content ||
      !activeConversation?.id ||
      !user?.id ||
      sending
    ) {
      return;
    }

    if (content.length > 5000) {
      setMessageError('Messages cannot exceed 5000 characters.');
      return;
    }

    setSending(true);
    setMessageError('');

    try {
      const conversationId = activeConversation.id;

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
        })
        .select('id, conversation_id, sender_id, content, created_at')
        .single();

      if (sendError) throw sendError;

      // Add the returned row immediately. Realtime may deliver the same
      // message too, so de-duplicate by ID.
      setMessages((current) => {
        if (current.some((item) => item.id === data.id)) {
          return current;
        }

        return [...current, data].sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      });

      setConversations((current) =>
        current
          .map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, latestMessage: data }
              : conversation
          )
          .sort((a, b) => {
            const timeA = new Date(
              a.latestMessage?.created_at || a.created_at
            ).getTime();

            const timeB = new Date(
              b.latestMessage?.created_at || b.created_at
            ).getTime();

            return timeB - timeA;
          })
      );

      setMessageText('');
      messageInputRef.current?.focus();
    } catch (err) {
      console.error('Unable to send message:', err);
      setMessageError(
        err.message || 'Message could not be sent. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return [
      conversation.otherPerson?.full_name,
      conversation.party?.title,
      conversation.latestMessage?.content,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  const formatMessageTime = (date) => {
    if (!date) return '';

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return '';

    return value.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  
const formatDateSeparator = (date) => {
  if (!date) return '';

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return '';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (value.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (value.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return value.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};


  const formatConversationTime = (date) => {
    if (!date) return '';

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return '';

    const sameDay =
      value.toDateString() === new Date().toDateString();

    return sameDay
      ? formatMessageTime(date)
      : value.toLocaleDateString([], {
          day: 'numeric',
          month: 'short',
        });
  };

  const renderAvatar = (person, size = 'h-11 w-11') => {
    const name = person?.full_name || 'Crashr member';

    if (person?.avatar_url) {
      return (
        <img
          src={person.avatar_url}
          alt={name}
          className={`${size} shrink-0 rounded-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-900`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-full border border-stone-200 bg-[#292524] px-5 py-3.5 text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-stone-800"
          aria-label="Open messages"
        >
          <MessageCircle size={21} />
          <span className="font-semibold">Messaging</span>
          {conversations.length > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
              {conversations.length}
            </span>
          )}
        </button>
      ) : (
        <section className="flex h-[min(620px,calc(100dvh-100px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#FDFBF7] shadow-2xl">
          {/* Header */}
          <header className="flex items-center justify-between bg-[#292524] px-4 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              {activeConversation && (
                <button
                  type="button"
                  onClick={closeConversation}
                  className="rounded-full p-1.5 transition hover:bg-white/10"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {activeConversation ? (
                <div className="flex min-w-0 items-center gap-2.5">
                  {renderAvatar(activeConversation.otherPerson, 'h-9 w-9')}
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold">
                      {activeConversation.otherPerson?.full_name ||
                        'Crashr member'}
                    </h2>
                    <p className="truncate text-xs text-stone-300">
                      {activeConversation.party?.title || 'Party chat'}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="flex items-center gap-2 font-bold">
                    <MessageCircle size={19} />
                    Your messages
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-300">
                    Your people. Your plans.
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {!activeConversation && (
                <button
                  type="button"
                  onClick={loadConversations}
                  disabled={loading}
                  className="rounded-full p-2 transition hover:bg-white/10 disabled:opacity-50"
                  aria-label="Refresh conversations"
                >
                  <RefreshCw
                    size={17}
                    className={loading ? 'animate-spin' : ''}
                  />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Minimize messages"
              >
                <Minus size={19} />
              </button>

              <button
                type="button"
                onClick={closeWidget}
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Close messages"
              >
                <X size={19} />
              </button>
            </div>
          </header>

          {activeConversation ? (
            <>
              {/* Party context */}
              {activeConversation.party && (
                <div className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-2.5">
                  {activeConversation.party.cover_image_url ? (
                    <img
                      src={activeConversation.party.cover_image_url}
                      alt=""
                      className="h-9 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-12 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                      <PartyPopper size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      Conversation about
                    </p>
                    <p className="truncate text-sm font-semibold text-stone-800">
                      {activeConversation.party.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Message history */}
              <div
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
                aria-live="polite"
              >
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center gap-2 text-sm text-stone-500">
                    <LoaderCircle size={19} className="animate-spin" />
                    Loading messages...
                  </div>
                ) : messageError && messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <AlertCircle size={28} className="text-amber-700" />
                    <p className="text-sm text-stone-600">{messageError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveConversation(null);
                        setTimeout(() => {
                          setActiveConversation(
                            activeConversationRef.current
                          );
                        }, 0);
                      }}
                      className="text-sm font-semibold text-amber-800 underline"
                    >
                      Back to conversations
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <MessageCircle size={27} />
                    </div>
                    <h3 className="font-semibold text-stone-800">
                      Start the conversation
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">
                      Say hello and start planning something fun.
                    </p>
                  </div>
                ) : (
                    messages.map((message, index) => {
                    const isMine = message.sender_id === user.id;
                    const previous = messages[index - 1];

                    const showSender =
                        !previous || previous.sender_id !== message.sender_id;

                    const showDate =
                        !previous ||
                        new Date(previous.created_at).toDateString() !==
                        new Date(message.created_at).toDateString();

                    return (
                        <div key={message.id} className="space-y-2.5">
                        {showDate && (
                            <div className="flex justify-center py-2">
                            <span className="rounded-full border border-stone-200 bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-stone-500 shadow-sm">
                                {formatDateSeparator(message.created_at)}
                            </span>
                            </div>
                        )}

                        <div
                            className={`flex ${
                            isMine ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div className="min-w-0 max-w-[88%]">
                            {showSender && !isMine && (
                                <p className="mb-1.5 ml-1 text-[11px] font-semibold text-stone-500">
                                {activeConversation.otherPerson?.full_name ||
                                    'Crashr member'}
                                </p>
                            )}

                            <div
                                className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${
                                isMine
                                    ? 'rounded-br-md bg-[#292524] text-white'
                                    : 'rounded-bl-md border border-stone-200 bg-white text-stone-800'
                                }`}
                            >
                                <p className="whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-relaxed">
                                {message.content}
                                </p>

                                <p
                                className={`mt-1.5 text-right text-[10px] ${
                                    isMine ? 'text-stone-300' : 'text-stone-400'
                                }`}
                                >
                                {formatMessageTime(message.created_at)}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                    })
                    )
                }
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="border-t border-stone-200/80 bg-white px-4 pb-4 pt-3 shadow-[0_-4px_16px_rgba(41,37,36,0.03)]">
                {messageError && messages.length > 0 && (
                  <p role="alert" className="mb-2 text-xs text-red-600">
                    {messageError}
                  </p>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-2"
                >
                  <textarea
                    ref={messageInputRef}
                    value={messageText}
                    onChange={(event) => {
                      setMessageText(event.target.value);
                      if (messageError) setMessageError('');
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Write a message..."
                    rows={1}
                    maxLength={5000}
                    disabled={sending || loadingMessages}
                    className="max-h-32 min-h-11 flex-1 resize-y rounded-2xl border border-stone-200 bg-[#FDFBF7] px-4 py-3 text-sm leading-relaxed text-stone-800 outline-none transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-100/70 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Message"
                  />

                  <button
                    type="submit"
                    disabled={!messageText.trim() || sending || loadingMessages}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <LoaderCircle size={19} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
                <p className="mt-1.5 text-[10px] text-stone-400">
                  Enter to send · Shift + Enter for a new line
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Conversation search */}
              <div className="border-b border-stone-200 px-4 py-3">
                <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 focus-within:border-amber-600">
                  <Search size={17} className="shrink-0 text-stone-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search people, parties..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                    aria-label="Search conversations"
                  />
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {loading && conversations.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-500">
                    <LoaderCircle size={19} className="animate-spin" />
                    Loading conversations...
                  </div>
                ) : error && conversations.length === 0 ? (
                  <div className="flex flex-col items-center px-5 py-10 text-center">
                    <AlertCircle
                      size={28}
                      className="mb-3 text-amber-700"
                    />
                    <p className="text-sm text-stone-600">{error}</p>
                    <button
                      type="button"
                      onClick={loadConversations}
                      className="mt-3 text-sm font-semibold text-amber-800 underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <button
                      type="button"
                      key={conversation.id}
                      onClick={() => openConversation(conversation)}
                      className="group flex w-full items-center gap-3 border-b border-stone-100/80 px-4 py-4 text-left transition-colors duration-200 hover:bg-amber-50/80 focus-visible:bg-amber-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-600">
                      {renderAvatar(conversation.otherPerson)}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-stone-800">
                            {conversation.otherPerson?.full_name ||
                              'Crashr member'}
                          </p>
                          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-500">
                            {formatConversationTime(
                              conversation.latestMessage?.created_at ||
                                conversation.created_at
                            )}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[11px] font-semibold tracking-wide text-amber-800">
                          {conversation.party?.title || 'Party chat'}
                        </p>                       
                        <p className="mt-1.5 truncate text-xs leading-relaxed text-stone-500">
                        {conversation.latestMessage ? (
                            <>
                            {conversation.latestMessage.sender_id === user.id && (
                                <span className="font-medium text-stone-600">
                                You:{" "}
                                </span>
                            )}
                            {conversation.latestMessage.content}
                            </>
                        ) : (
                            <span className="italic text-stone-400">
                            No messages yet — say hello!
                            </span>
                        )}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center px-6 py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <PartyPopper size={29} />
                    </div>

                    <h3 className="font-semibold text-stone-800">
                      {searchQuery
                        ? 'No matching conversations'
                        : 'Your next great conversation starts here'}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-stone-500">
                      {searchQuery
                        ? 'Try another name or party title.'
                        : 'Explore parties and connect with hosts to make plans.'}
                    </p>

                    {!searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/explore');
                        }}
                        className="mt-5 rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800"
                      >
                        Explore parties
                      </button>
                    )}
                  </div>
                )}
              </div>

              <footer className="border-t border-stone-200 px-4 py-2.5 text-center text-[11px] text-stone-400">
                Good vibes start with a conversation.
              </footer>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default FloatingChatWidget;
