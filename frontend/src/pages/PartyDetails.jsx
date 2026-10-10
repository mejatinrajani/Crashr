import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Music, Loader2, ArrowLeft, Lock, Ticket, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { supabase } from '../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import {
  Share2,
  Copy,
  CalendarPlus,
  Heart,
} from 'lucide-react';

export default function PartyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(null); 

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('crashr-favorites') || '[]'
      );

      return Array.isArray(saved) && saved.includes(String(id));
    } catch {
      return false;
    }
  });


  
useEffect(() => {
  let isMounted = true;

  const fetchPartyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/parties/${id}`);

      if (isMounted) {
        setParty(response.data);
      }
    } catch (err) {
      console.error("Error fetching party details:", err);

      if (isMounted) {
        setError(
          "We couldn't find this party. It may have been canceled or removed."
        );
        setParty(null);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchPartyDetails();

  return () => {
    isMounted = false;
  };
}, [id]);


const isHost = user?.id === party?.host_id;

const organizerName =
  party?.profiles?.full_name || 'Anonymous Host';

const organizerAvatar =
  party?.profiles?.avatar_url;

const organizerInitial =
  organizerName.trim().charAt(0).toUpperCase() || 'H';


const handlePayment = async () => {
  setIsPurchasing(true);

  try {
    const { data: ticketData } = await api.get(
      `/tickets/my-ticket/${id}`
    );

    await api.post(`/tickets/${ticketData.id}/pay`);

    setTicketStatus("confirmed");
    toast.success("Payment successful! You are on the list.");
  } catch (err) {
    console.error(err);
    toast.error("Payment failed. Please try again.");
  } finally {
    setIsPurchasing(false);
  }
};

  const handlePurchaseTicket = async () => {
    if (!user) {
      toast.error("Please log in to purchase a ticket!");
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await api.post('/tickets', { party_id: id });
      setTicketStatus(response.data.status);
      
      if (response.data.status === 'pending') {
        toast.success("Request sent! Waiting for host approval.");
      } else {
        toast.success("Ticket secured successfully!");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error("Could not process ticket. You might already be on the list!"); 
    } finally {
      setIsPurchasing(false);
    }
  };

  
const getEventUrl = () => window.location.href;

const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(getEventUrl());
    toast.success("Party link copied!");
  } catch (err) {
    console.error("Copy link failed:", err);
    toast.error("Couldn't copy the link. Please copy the URL from your browser.");
  }
};

const handleShare = async () => {
  const shareData = {
    title: party.title,
    text: `Check out ${party.title} on Crashr!`,
    url: getEventUrl(),
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await handleCopyLink();
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Share failed:", err);
      toast.error("Couldn't share this party.");
    }
  }
};

const escapeICS = (value = "") =>
  String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

const handleAddToCalendar = () => {
  if (!party.event_time || Number.isNaN(new Date(party.event_time).getTime())) {
    toast.error("This party doesn't have a valid event date yet.");
    return;
  }

  const start = new Date(party.event_time);

  // Calendar files use UTC timestamps.
  const formatICSDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  // Use a one-hour duration until an actual end time is available.
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const calendarContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Crashr//Party Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@crashr`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICS(party.title || "Crashr Party")}`,
    `DESCRIPTION:${escapeICS(party.description || "Party on Crashr")}`,
    `LOCATION:${escapeICS(party.location || "")}`,
    `URL:${escapeICS(getEventUrl())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([calendarContent], {
    type: "text/calendar;charset=utf-8",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `${(party.title || "crashr-party")
    .replace(/[^a-z0-9-_]/gi, "-")
    .slice(0, 60)}.ics`;

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);

  toast.success("Calendar event downloaded!");
};


const handleToggleFavorite = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem('crashr-favorites') || '[]'
    );

    const favorites = Array.isArray(saved) ? saved : [];
    const partyId = String(id);

    const updatedFavorites = isFavorite
      ? favorites.filter((favoriteId) => String(favoriteId) !== partyId)
      : [...new Set([...favorites.map(String), partyId])];

    localStorage.setItem(
      'crashr-favorites',
      JSON.stringify(updatedFavorites)
    );

    setIsFavorite(!isFavorite);

    toast.success(
      isFavorite
        ? 'Removed from favorites'
        : 'Added to favorites!'
    );
  } catch (err) {
    console.error('Favorite update failed:', err);
    toast.error('Could not update favorites. Please try again.');
  }
};



  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-6 pt-20">
        <Loader2 className="animate-spin text-[#D97706]" size={56} strokeWidth={1.5} />
        <p className="text-[#D97706] font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
          Locating the party...
        </p>
      </div>
    );
  }

  if (error || !party) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-40 text-center">
        <div className="bg-[#292524] text-[#FDFBF7] p-8 rounded-md font-bold tracking-tight shadow-xl shadow-[#292524]/10 border border-[#1C1917] mb-8">
          {error || "We couldn't find this party. It may have been canceled or removed."}
        </div>
        <Link to="/">
          <Button variant="rounded" color="gold">Back to the Feed</Button>
        </Link>
      </div>
    );
  }

  
return (
  <div className="relative min-h-screen bg-black text-white selection:bg-amber-500/30">
    {/* Keep Crashr's existing immersive background unchanged */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      {party.cover_image_url ? (
        <img
          src={party.cover_image_url}
          alt=""
          className="h-full w-full object-cover opacity-80 scale-105"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[#292524] to-[#1C1917]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
    </div>

    {/* Navigation */}
    <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 pt-5 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border-white/15 bg-black/30 text-white backdrop-blur-xl transition hover:bg-white/15"
        aria-label="Back to parties"
      >
        <ArrowLeft size={20} />
      </Link>

      <span className="rounded-md border-white/15 bg-black/30 px-4 py-2 text-xs font-bold tracking-wide text-white/80 backdrop-blur-xl">
        CRASHR · EVENT DETAILS
      </span>
    </div>

    <main className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-16">
      {/* Premium event hero */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-md border border-white/15 bg-black/35 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-md"
      >
        <div className="relative px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {party.requires_approval && (
              <span className="inline-flex items-center gap-2 rounded-md border-white/15 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/90">
                <Lock size={12} />
                Approval required
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-md border-amber-400/30 bg-amber-500/15 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-200">
              <Users size={13} />
              {party.capacity} guest limit
            </span>
          </div>

          <h1 className="mb-5 max-w-4xl break-words text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {party.title}
          </h1>

          <p className="mb-8 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
            {party.description || "Get ready for a memorable experience. Explore the details and secure your spot."}
          </p>

          <div className="grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-2">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-400/20 bg-amber-500/10 text-amber-400">
                <Calendar size={20} />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Date & time
                </p>
                <p className="break-words text-sm font-semibold leading-6 text-white sm:text-base">
                  {formatDateTime(party.event_time)}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-400/20 bg-amber-500/10 text-amber-400">
                <MapPin size={20} />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Location
                </p>
                <p className="break-words text-sm font-semibold leading-6 text-white sm:text-base">
                  {ticketStatus === "confirmed"
                    ? party.exact_address || party.location
                    : party.location}
                </p>
                {ticketStatus !== "confirmed" && (
                  <p className="mt-1 text-xs text-white/45">
                    Exact address may be shared after confirmation.
                  </p>
                )}
              </div>
            </div>
          </div>
          
<div className="mt-7 flex flex-wrap gap-3 border-t border-white/15 pt-6">
  <button
    type="button"
    onClick={handleShare}
    className="inline-flex items-center gap-2 rounded-md border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
  >
    <Share2 size={16} />
    Share party
  </button>

  <button
    type="button"
    onClick={handleCopyLink}
    className="inline-flex items-center gap-2 rounded-md border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
  >
    <Copy size={16} />
    Copy link
  </button>

  <button
    type="button"
    onClick={handleAddToCalendar}
    className="inline-flex items-center gap-2 rounded-md border-amber-400/30 bg-amber-500/15 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-400"
  >
    <CalendarPlus size={16} />
    Add to calendar
  </button>
  
<button
  type="button"
  onClick={handleToggleFavorite}
  aria-pressed={isFavorite}
  aria-label={
    isFavorite
      ? 'Remove party from favorites'
      : 'Add party to favorites'
  }
  className={`inline-flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
    isFavorite
      ? 'border-rose-400/40 bg-rose-500/15 text-rose-200'
      : 'border-white/15 bg-white/10 text-white hover:bg-white/20'
  }`}
>
  <Heart
    size={16}
    fill={isFavorite ? 'currentColor' : 'none'}
  />
  {isFavorite ? 'Saved to favorites' : 'Add to favorites'}
</button>

</div>

        </div>
      </motion.section>

      {/* Main content and booking panel */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <div className="space-y-6">
          {/* About this party */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-md border border-white/15 bg-black/35 p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
                <Music size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                  About this party
                </h2>
                <p className="mt-1 text-xs text-white/50">
                  Everything you need to know before you go.
                </p>
              </div>
            </div>

            <p className="whitespace-pre-line break-words text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              {party.description || "The host hasn't added a description yet. Check back later for more details."}
            </p>
          </motion.section>

          
{/* Organizer Spotlight */}
<section className="relative overflow-hidden rounded-3xl border border-stone-900/10 bg-white/70 p-6 shadow-sm backdrop-blur-xl sm:p-8">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-200/30 blur-3xl"
  />

  <div className="relative">
    <div className="mb-6 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-800">
        Meet your host
      </p>
    </div>

    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      {organizerAvatar ? (
        <img
          src={organizerAvatar}
          alt={`${organizerName}'s profile`}
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white object-cover shadow-md"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 text-3xl font-black text-orange-900 shadow-sm"
        >
          {organizerInitial}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="break-words text-2xl font-black tracking-tight text-stone-900">
            {organizerName}
          </h3>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-800">
            <Sparkles size={12} />
            Party host
          </span>
        </div>

        <p className="max-w-xl text-sm leading-6 text-stone-600">
          Every great night starts with great people. Get ready to
          connect, enjoy the atmosphere, and make the night memorable.
        </p>
      </div>
    </div>
  </div>
</section>


          {/* Event essentials */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="rounded-md border border-white/15 bg-black/35 p-6 backdrop-blur-xl sm:p-8"
          >
            <h2 className="mb-5 text-xl font-black tracking-tight sm:text-2xl">
              Event essentials
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <Calendar className="mb-3 text-amber-400" size={20} />
                <p className="mb-1 text-xs text-white/50">When</p>
                <p className="break-words text-sm font-semibold leading-6">
                  {formatDateTime(party.event_time)}
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <Users className="mb-3 text-amber-400" size={20} />
                <p className="mb-1 text-xs text-white/50">Guest capacity</p>
                <p className="text-sm font-semibold">
                  {party.capacity} guests
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
                <MapPin className="mb-3 text-amber-400" size={20} />
                <p className="mb-1 text-xs text-white/50">Where</p>
                <p className="break-words text-sm font-semibold leading-6">
                  {party.location}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Desktop booking card */}
        <aside className="hidden lg:block lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-md border border-white/15 bg-[#FDFBF7] p-6 text-[#292524] shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78716C]">
              Your next experience
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-[#D97706]">
                {formatCurrency(party.price)}
              </span>
              <span className="mb-1 text-sm text-[#78716C]">
                / guest
              </span>
            </div>

            <div className="my-6 border-t border-[#292524]/10" />

            <div className="mb-5 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar size={17} className="shrink-0 text-[#D97706]" />
                <span className="leading-6">{formatDateTime(party.event_time)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={17} className="shrink-0 text-[#D97706]" />
                <span>{party.capacity} guest limit</span>
              </div>
            </div>

            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="rectangular"
              color="gold"
              className="w-full py-5 text-base shadow-lg shadow-amber-900/15"
            >
              {ticketStatus === "confirmed"
                ? "View Ticket Status"
                : isHost
                  ? "Manage Your Party"
                  : "Access Tickets"}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#78716C]">
              <Lock size={13} />
              Your booking is handled securely through Crashr.
            </p>
          </div>
        </aside>
      </div>
    </main>

    {/* Mobile booking bar */}
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#1C1917]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            Price per guest
          </p>
          <p className="truncate text-xl font-black text-amber-400">
            {formatCurrency(party.price)}
          </p>
        </div>

        <Button
          onClick={() => setIsDrawerOpen(true)}
          variant="rectangular"
          color="gold"
          className="min-w-[155px] py-4 text-sm"
        >
          {ticketStatus === "confirmed"
            ? "View Ticket Status"
            : isHost
              ? "Manage Party"
              : "Access Tickets"}
        </Button>
      </div>
    </div>

    {/* Existing ticket drawer and booking flow */}
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-40 cursor-pointer bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center"
          >
            <div className="pointer-events-auto max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-md border-t border-white/20 bg-[#FDFBF7] p-6 pb-10 text-[#292524] shadow-2xl sm:rounded-t-[2.5rem] sm:p-8">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="mb-6 flex h-8 w-full items-center justify-center"
                aria-label="Close ticket panel"
              >
                <span className="h-1.5 w-12 rounded-md bg-[#292524]/20" />
              </button>

              <div className="mb-7">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#78716C]">
                  Your booking
                </p>
                <h2 className="text-2xl font-black leading-tight sm:text-3xl">
                  {party.title}
                </h2>
                <p className="mt-2 text-sm text-[#78716C]">
                  {formatDateTime(party.event_time)}
                </p>

                <div className="mt-5 flex items-end justify-between border-b border-[#292524]/10 pb-6">
                  <span className="text-4xl font-black tracking-tight text-[#D97706]">
                    {formatCurrency(party.price)}
                  </span>
                  <span className="mb-1 text-xs font-bold uppercase tracking-wider text-[#78716C]">
                    Per guest
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {isHost ? (
                  <Link to="/dashboard" className="block">
                    <Button
                      variant="rectangular"
                      color="espresso"
                      className="w-full py-5 text-base"
                    >
                      Manage Guest List
                    </Button>
                  </Link>
                ) : !ticketStatus ? (
                  <Button
                    onClick={handlePurchaseTicket}
                    variant="rectangular"
                    color="gold"
                    disabled={isPurchasing}
                    className="w-full py-5 text-base disabled:opacity-70"
                  >
                    {isPurchasing ? (
                      <Loader2 className="mx-auto animate-spin" size={24} />
                    ) : (
                      "Request Ticket"
                    )}
                  </Button>
                ) : ticketStatus === "pending" ? (
                  <div className="flex items-center justify-center gap-2 rounded-md border border-[#D97706]/20 bg-[#D97706]/10 p-5 font-bold text-[#D97706]">
                    <Clock size={22} />
                    Request Pending
                  </div>
                ) : ticketStatus === "approved" ? (
                  <Button
                    onClick={handlePayment}
                    variant="rectangular"
                    color="gold"
                    disabled={isPurchasing}
                    className="w-full py-5 text-base disabled:opacity-70"
                  >
                    {isPurchasing ? (
                      <Loader2 className="mx-auto animate-spin" size={24} />
                    ) : (
                      "Pay to Confirm Spot"
                    )}
                  </Button>
                ) : ticketStatus === "confirmed" ? (
                  <div className="flex items-center justify-center gap-2 rounded-md bg-[#292524] p-5 font-bold text-[#FDFBF7]">
                    <CheckCircle2 size={22} />
                    You're Going!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-md bg-[#292524]/5 p-5 font-bold text-[#78716C]">
                    <Ticket size={22} />
                    On Waitlist
                  </div>
                )}

                {!user && !ticketStatus && (
                  <p className="text-center text-xs font-semibold text-red-500">
                    Log in to join the guest list.
                  </p>
                )}

                <p className="flex items-center justify-center gap-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  <Lock size={12} />
                  Secure transaction via Crashr
                </p>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full rounded-md py-3 text-sm font-semibold text-[#78716C] transition hover:bg-[#292524]/5 hover:text-[#292524]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
);

}