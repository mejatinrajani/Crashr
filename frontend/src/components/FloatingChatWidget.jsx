
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Minus,
  Search,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FloatingChatWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);

  // Keep the messaging widget available only to signed-in users.
  if (!user) return null;

  const closeWidget = () => {
    setIsOpen(false);
    setActiveConversation(null);
  };

  return (
    <div className="fixed bottom-0 right-4 sm:right-6 z-[100] font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open messages"
          className="flex items-center gap-3 rounded-t-2xl bg-[#292524] px-5 py-4 text-white shadow-[0_-4px_24px_rgba(41,37,36,0.18)] transition hover:bg-[#44403C]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D97706]">
            <MessageCircle size={19} />
          </span>

          <span className="text-sm font-semibold tracking-wide">
            Messaging
          </span>

          <span className="ml-2 flex h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
        </button>
      ) : (
        <section
          aria-label="Crashr messaging"
          className="flex h-[min(560px,75vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-t-2xl border border-[#E7E0D5] bg-[#FDFBF7] shadow-[0_0_40px_rgba(41,37,36,0.18)] sm:w-[360px]"
        >
          {/* Header */}
          <header className="flex items-center justify-between bg-[#292524] px-4 py-3.5 text-white">
            <div className="flex min-w-0 items-center gap-3">
              {activeConversation && (
                <button
                  type="button"
                  onClick={() => setActiveConversation(null)}
                  aria-label="Back to conversations"
                  className="rounded-full p-1.5 transition hover:bg-white/10"
                >
                  <ArrowLeft size={19} />
                </button>
              )}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D97706]">
                <MessageCircle size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-bold">
                  {activeConversation
                    ? activeConversation.title
                    : 'Messaging'}
                </h2>
                <p className="text-xs text-white/65">
                  {activeConversation
                    ? 'Party conversation'
                    : 'Your Crashr conversations'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize messages"
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <Minus size={18} />
              </button>

              <button
                type="button"
                onClick={closeWidget}
                aria-label="Close messages"
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {!activeConversation ? (
            <>
              {/* Conversation search */}
              <div className="border-b border-[#E7E0D5] p-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#E7E0D5] bg-white px-3 py-2.5 focus-within:border-[#D97706]">
                  <Search size={17} className="text-[#78716C]" />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search conversations"
                    aria-label="Search conversations"
                    className="w-full bg-transparent text-sm text-[#292524] outline-none placeholder:text-[#A8A29E]"
                  />
                </div>
              </div>

              {/* Inbox placeholder until Supabase is connected */}
              <div className="flex flex-1 flex-col items-center justify-center px-7 py-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5E9D7] text-[#B45309]">
                  <MessageCircle size={29} />
                </div>

                <h3 className="text-base font-bold text-[#292524]">
                  Your conversations start here
                </h3>

                <p className="mt-2 max-w-[260px] text-sm leading-6 text-[#78716C]">
                  Message party hosts to ask questions, discuss plans,
                  and get ready for your next Crashr experience.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/explore');
                  }}
                  className="mt-5 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B45309]"
                >
                  Explore parties
                </button>
              </div>

              <footer className="border-t border-[#E7E0D5] px-4 py-3 text-center">
                <p className="text-xs text-[#78716C]">
                  Good plans start with a conversation.
                </p>
              </footer>
            </>
          ) : (
            <>
              {/* Conversation view will be connected to Supabase next. */}
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <MessageCircle
                  size={30}
                  className="mb-3 text-[#D97706]"
                />
                <p className="text-sm text-[#78716C]">
                  The chat will appear here once conversations are
                  connected.
                </p>
              </div>

              <div className="border-t border-[#E7E0D5] p-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#E7E0D5] bg-white px-3 py-2.5">
                  <input
                    disabled
                    placeholder="Messages will be enabled next..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                  <Send size={17} className="text-[#A8A29E]" />
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default FloatingChatWidget;
