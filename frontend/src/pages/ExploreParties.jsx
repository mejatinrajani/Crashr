import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Loader2,
  Search,
  MapPin,
  MapPinOff,
  CalendarDays,
  SlidersHorizontal,
  PartyPopper,
  Compass,
  RotateCcw,
} from 'lucide-react';




import PartyCard from '../components/PartyCard';
import Button from '../components/Button';
import api from '../services/api';
import { formatDateTime, formatCurrency } from '../utils/formatters';

const FILTERS = [
  { label: 'All parties', value: 'all' },
  { label: 'Tonight', value: 'tonight' },
  { label: 'This weekend', value: 'weekend' },
  { label: 'Under ₹500', value: 'budget' },
];

function getPartyLocation(party) {
  const location = party?.location;

  if (typeof location === 'string') return location;

  if (location && typeof location === 'object') {
    return [location.name, location.city, location.address]
      .filter(Boolean)
      .join(', ');
  }

  return '';
}

function getPartyDate(party) {
  const value = party?.event_time || party?.starts_at;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getPartyPrice(party) {
  if (party?.price === null || party?.price === undefined || party?.price === '') {
    return null;
  }

  const price = Number(party.price);

  return Number.isFinite(price) ? price : null;
}

function matchesDateFilter(party, filter) {
  if (filter === 'all' || filter === 'budget') return true;

  const date = getPartyDate(party);

  if (!date) return false;

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (filter === 'tonight') {
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    return date >= now && date < tomorrowStart;
  }

  if (filter === 'weekend') {
    const saturday = new Date(todayStart);
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
    saturday.setDate(saturday.getDate() + daysUntilSaturday);

    const weekendStart =
      now.getDay() === 0 ? todayStart : saturday;

    const monday = new Date(weekendStart);
    monday.setDate(monday.getDate() + 2);

    return date >= now && date < monday;
  }

  return true;
}

export default function ExploreParties() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [maxBudget, setMaxBudget] = useState(500);
  const [sortBy, setSortBy] = useState('soonest');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const searchTerm = searchParams.get('q') || '';

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const fetchParties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/parties');
      const data = response.data;

      const partyList = Array.isArray(data)
        ? data
        : Array.isArray(data?.parties)
          ? data.parties
          : [];

      setParties(partyList);
    } catch (err) {
      console.error('Error fetching parties:', err);
      setError('We couldn’t load the parties right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const filteredParties = useMemo(() => {
    return parties.filter((party) => {
      const location = getPartyLocation(party).toLowerCase();
      const title = String(party?.title || '').toLowerCase();
      const term = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !term || location.includes(term) || title.includes(term);

      const matchesFilter = matchesDateFilter(party, activeFilter);
      const price = getPartyPrice(party);

      const matchesBudget =
        activeFilter !== 'budget' ||
        (price !== null && price <= maxBudget);

      return matchesSearch && matchesFilter && matchesBudget;
    });
  }, [parties, searchTerm, activeFilter, maxBudget]);

  const sortedParties = useMemo(() => {
    const result = [...filteredParties];

    result.sort((a, b) => {
      const priceA = getPartyPrice(a);
      const priceB = getPartyPrice(b);

      if (sortBy === 'price-low') {
        if (priceA === null) return priceB === null ? 0 : 1;
        if (priceB === null) return -1;
        return priceA - priceB;
      }

      if (sortBy === 'price-high') {
        if (priceA === null) return priceB === null ? 0 : 1;
        if (priceB === null) return -1;
        return priceB - priceA;
      }

      const dateA = getPartyDate(a);
      const dateB = getPartyDate(b);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateA.getTime() - dateB.getTime();
    });

    return result;
  }, [filteredParties, sortBy]);

  const submitSearch = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams);
    const term = searchInput.trim();

    if (term) {
      nextParams.set('q', term);
    } else {
      nextParams.delete('q');
    }

    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    setSearchInput('');

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setActiveFilter('all');
    setMaxBudget(500);
    setSortBy('soonest');
    clearSearch();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.28 },
    },
  };

  return (
    <main className="crashr-home min-h-screen pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <section className="home-hero mb-10 sm:mb-14">
          <div className="home-eyebrow mb-5">
            <span className="home-eyebrow-dot" />
            YOUR PLANS START HERE
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="home-title">
                Explore the
                <br />
                <span className="home-title-accent">whole scene.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Every gathering, every vibe. Find your next house party,
                meet new people, and make plans worth remembering.
              </p>
            </div>

            <div className="home-search-panel">
              <p className="mb-3 text-sm font-bold text-stone-800">
                What are you in the mood for?
              </p>

              <form onSubmit={submitSearch} className="home-search-form">
                <MapPin size={19} className="shrink-0 text-amber-700" />

                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search party name or city..."
                  aria-label="Search parties by name or city"
                  className="home-search-input"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="home-clear-search"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  className="home-search-submit"
                  aria-label="Search parties"
                >
                  <Search size={19} />
                </button>
              </form>

              <p className="mt-3 text-xs leading-5 text-stone-500">
                Search by party name or location.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-label="Party filters">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={19} className="text-amber-700" />
                <h2 className="text-xl font-black tracking-tight text-stone-900 sm:text-2xl">
                  Find your kind of night
                </h2>
              </div>
              <p className="mt-1 text-sm text-stone-500">
                Filter the listings and find your next plan.
              </p>
            </div>

            {(searchTerm || activeFilter !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className="home-reset-button"
              >
                <RotateCcw size={14} />
                Reset filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={activeFilter === filter.value}
                className={`home-filter ${
                  activeFilter === filter.value ? 'home-filter-active' : ''
                }`}
              >
                {filter.value === 'tonight' && <CalendarDays size={15} />}
                {filter.value === 'weekend' && <PartyPopper size={15} />}
                {filter.value === 'budget' && <SlidersHorizontal size={15} />}
                {filter.label}
              </button>
            ))}
          </div>

          {activeFilter === 'budget' && (
            <div className="mt-5 max-w-xl rounded-2xl border border-orange-200/70 bg-white/70 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-stone-900">
                    Your maximum budget
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Find parties within your price range.
                  </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-2 text-sm font-black text-orange-800">
                  ₹{maxBudget}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={maxBudget}
                onChange={(event) => setMaxBudget(Number(event.target.value))}
                aria-label="Maximum party budget in rupees"
                className="w-full cursor-pointer accent-orange-600"
              />

              <div className="mt-2 flex justify-between text-xs font-semibold text-stone-500">
                <span>₹0</span>
                <span>₹2,500</span>
                <span>₹5,000</span>
              </div>
            </div>
          )}
        </section>

        {loading ? (
          <div
            className="flex flex-col items-center justify-center gap-5 py-28"
            role="status"
          >
            <Loader2
              className="animate-spin text-amber-700"
              size={42}
              strokeWidth={1.5}
            />
            <p className="text-sm font-bold tracking-widest text-amber-800">
              FINDING YOUR NEXT VIBE...
            </p>
            <span className="sr-only">Loading parties</span>
          </div>
        ) : error ? (
          <div className="home-state-panel">
            <div className="home-state-icon">
              <MapPinOff size={26} />
            </div>
            <h2 className="text-2xl font-black text-stone-900">
              We lost the party trail.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              {error}
            </p>
            <div className="mt-6">
              <Button
                onClick={fetchParties}
                variant="rectangular"
                color="espresso"
              >
                Try again
              </Button>
            </div>
          </div>
        ) : parties.length === 0 ? (
          <div className="home-state-panel">
            <div className="home-state-icon">
              <PartyPopper size={26} />
            </div>
            <h2 className="text-2xl font-black text-stone-900">
              The scene is waiting for you.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              There are no parties to display yet. Be the first to create
              a gathering and bring your people together.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/host')}
                variant="rectangular"
                color="espresso"
              >
                Host a party
              </Button>
            </div>
          </div>
        ) : filteredParties.length === 0 ? (
          <div className="home-state-panel">
            <div className="home-state-icon">
              <MapPinOff size={26} />
            </div>
            <h2 className="text-2xl font-black text-stone-900">
              No parties found. Yet.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-stone-600">
              Try another search, adjust your filters, or reset everything
              to see all available parties.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={resetFilters}
                variant="rectangular"
                color="espresso"
              >
                Show all parties
              </Button>
              <Button
                onClick={() => navigate('/host')}
                variant="rectangular"
                color="white"
              >
                Host a party
              </Button>
            </div>
          </div>
        ) : (
          <section aria-label="Available parties">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
                  {activeFilter === 'tonight'
                    ? "Tonight's plans"
                    : activeFilter === 'weekend'
                      ? 'This weekend'
                      : activeFilter === 'budget'
                        ? 'Easy on the wallet'
                        : searchTerm
                          ? 'Matching parties'
                          : 'All parties'}
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  {filteredParties.length}{' '}
                  {filteredParties.length === 1 ? 'party' : 'parties'} to explore
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="explore-party-sort"
                  className="whitespace-nowrap text-sm font-bold text-stone-600"
                >
                  Sort by
                </label>
                <select
                  id="explore-party-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="min-h-11 max-w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="soonest">Earliest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {sortedParties.map((party) => (
                <motion.div
                  key={party.id}
                  variants={item}
                  className="min-w-0"
                >
                  <PartyCard
                    party={{
                      ...party,
                      location: getPartyLocation(party),
                      time: formatDateTime(party.event_time || party.starts_at),
                      price: formatCurrency(party.price),
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {!loading && !error && parties.length > 0 && (
          <div className="home-discovery-footer mt-14">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <PartyPopper size={18} />
              <span className="text-xs font-black tracking-widest">
                GOOD PEOPLE. GOOD PARTIES. GOOD STORIES.
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}



