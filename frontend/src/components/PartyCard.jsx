import { Link } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Users,
  Sparkles,
  PartyPopper,
} from 'lucide-react';

export default function PartyCard({ party }) {
  const hostName =
    party.profiles?.full_name || 'Anonymous Host';

  const avatarUrl = party.profiles?.avatar_url;
  const coverImageUrl = party.cover_image_url;
  const title = party.title || 'Untitled Party';

  const location =
    typeof party.location === 'string'
      ? party.location
      : party.location?.name ||
        party.location?.city ||
        party.location?.address ||
        'Location shared after joining';

  const price =
    party.price !== undefined && party.price !== null
      ? party.price
      : 'Price unavailable';

  const eventTime = party.time || 'Date to be announced';

  const hostInitial =
    hostName.trim().charAt(0).toUpperCase() || 'H';

  return (
    <article className="group relative flex h-[610px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-stone-900/[0.07] bg-white/65 shadow-[0_8px_30px_rgba(41,37,36,0.04)] backdrop-blur-lg transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange-500/30 hover:shadow-[0_20px_50px_rgba(41,37,36,0.11)]">

      {/* Animated top accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-700 transition-transform duration-500 group-hover:scale-x-100"
      />

      {/* ========================================================= */}
      {/* TOP 40% — HOST UPLOADED PARTY IMAGE */}
      {/* ========================================================= */}

      <div className="relative h-[224px] shrink-0 overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-stone-100">

        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={`${title} party cover`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200"
          >
            <PartyPopper
              size={46}
              strokeWidth={1.5}
              className="text-orange-500/50"
            />
          </div>
        )}

        {/* Image overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/25 via-transparent to-transparent"
        />

        {/* Party type */}
        <div className="absolute left-5 top-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-orange-800 shadow-sm backdrop-blur-md">
            <PartyPopper size={13} />
            House party
          </span>
        </div>

        {/* Sparkles */}
        <Sparkles
          size={20}
          aria-hidden="true"
          className="absolute right-5 top-5 shrink-0 text-white drop-shadow-md transition-all duration-300 group-hover:rotate-12 group-hover:scale-125"
        />
      </div>

      {/* ========================================================= */}
      {/* BOTTOM 60% — EXISTING PARTY DETAILS */}
      {/* ========================================================= */}

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5 sm:px-6">

        {/* Party title */}
        <h3 className="mb-4 min-h-[3.4rem] break-words text-[24px] font-black leading-[1.1] tracking-[-0.055em] text-stone-900 transition-colors duration-200 group-hover:text-orange-800 sm:text-[27px]">
          {title}
        </h3>

        {/* Host identity */}
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${hostName}'s avatar`}
                loading="lazy"
                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-orange-100 to-amber-200 text-sm font-black text-orange-900 shadow-sm"
              >
                {hostInitial}
              </div>
            )}

            <span
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-stone-400">
              Your potential host
            </p>

            <p
              className="truncate text-sm font-extrabold text-stone-800"
              title={hostName}
            >
              {hostName}
            </p>
          </div>
        </div>

        {/* Party information */}
        <div className="space-y-2.5">

          {/* Date / Time */}
          <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-stone-900/[0.025] p-2.5 transition-colors duration-200 group-hover:bg-orange-500/[0.045]">

            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-orange-700 shadow-sm">
              <CalendarDays size={16} />
            </div>

            <div className="min-w-0 flex-1 py-0.5">
              <p className="mb-0.5 text-[8px] font-black uppercase tracking-[0.13em] text-stone-400">
                When
              </p>

              <p className="break-words text-xs font-bold leading-4 text-stone-700">
                {eventTime}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-stone-900/[0.025] p-2.5 transition-colors duration-200 group-hover:bg-orange-500/[0.045]">

            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-orange-700 shadow-sm">
              <MapPin size={16} />
            </div>

            <div className="min-w-0 flex-1 py-0.5">
              <p className="mb-0.5 text-[8px] font-black uppercase tracking-[0.13em] text-stone-400">
                Where
              </p>

              <p className="break-words text-xs font-bold leading-4 text-stone-700">
                {location}
              </p>
            </div>
          </div>

          {/* Capacity */}
          {party.capacity != null && (
            <div className="flex items-center gap-3 px-1 pt-0.5">
              <Users
                size={15}
                className="shrink-0 text-orange-700"
              />

              <p className="text-xs font-semibold text-stone-500">
                <span className="font-extrabold text-stone-800">
                  {party.capacity}
                </span>{' '}
                guest spots
              </p>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="mt-auto pt-4">

          <div className="mb-3 border-t border-dashed border-stone-900/10" />

          <div className="flex items-end justify-between gap-3">

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[8px] font-black uppercase tracking-[0.16em] text-stone-400">
                Your entry
              </p>

              <p className="break-words text-[25px] font-black leading-none tracking-[-0.06em] text-stone-900 sm:text-[28px]">
                {price}
              </p>
            </div>

            <Link
              to={`/party/${party.id}`}
              aria-label={`Explore ${title}`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_8px_20px_rgba(234,88,12,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 active:translate-y-0 sm:px-5"
            >
              <span>Let's go</span>

              <ArrowUpRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

          </div>
        </div>
      </div>
    </article>
  );
}