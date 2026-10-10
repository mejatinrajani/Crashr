
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PartyCard from '../components/PartyCard';
import Button from '../components/Button';
import api from '../services/api';
import {
  formatDateTime,
  formatCurrency,
} from '../utils/formatters';
import {
  Loader2,
  MapPin,
  MapPinOff,
  Search,
  Compass,
  CalendarDays,
  SlidersHorizontal,
  PartyPopper,
  RotateCcw,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';



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
    return [
      location.name,
      location.city,
      location.address,
    ].filter(Boolean).join(', ');
  }

  return '';
}

function getPartyDate(party) {
  const value = party?.event_time || party?.starts_at;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
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
    saturday.setDate(
      saturday.getDate() + daysUntilSaturday
    );

    // If it is Sunday, include today as part of this weekend.
    const weekendStart =
      now.getDay() === 0 ? todayStart : saturday;

    const monday = new Date(weekendStart);
    monday.setDate(monday.getDate() + 2);

    return date >= now && date < monday;
  }

  return true;
}

function getPartyPrice(party) {
  const price = Number(party?.price);

  return Number.isFinite(price) ? price : null;
}

export default function Home() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [maxBudget, setMaxBudget] = useState(500);
  const [sortBy, setSortBy] = useState('soonest');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const searchCity = searchParams.get('city') || '';

  useEffect(() => {
    setSearchInput(searchCity);
  }, [searchCity]);

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
      setError(
        'We couldn’t load the parties right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const filteredParties = useMemo(() => {
    return parties.filter((party) => {
      const location = getPartyLocation(party);

      
const searchTerm = searchCity.trim().toLowerCase();

const matchesSearch =
  !searchTerm ||
  location.toLowerCase().includes(searchTerm) ||
  String(party?.title || '').toLowerCase().includes(searchTerm);


      const matchesFilter = matchesDateFilter(
        party,
        activeFilter
      );

      const price = getPartyPrice(party);

      const matchesBudget =
  activeFilter !== 'budget' ||
  (price !== null && price <= maxBudget);

      return (
  matchesSearch &&
  matchesFilter &&
  matchesBudget
);
    });
  }, [parties, searchCity, activeFilter, maxBudget]);
  
const sortedParties = useMemo(() => {
  const result = [...filteredParties];

  result.sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = getPartyPrice(a);
      const priceB = getPartyPrice(b);

      if (priceA === null) return 1;
      if (priceB === null) return -1;

      return priceA - priceB;
    }

    if (sortBy === 'price-high') {
      const priceA = getPartyPrice(a);
      const priceB = getPartyPrice(b);

      if (priceA === null) return 1;
      if (priceB === null) return -1;

      return priceB - priceA;
    }

    // Default: upcoming parties first
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

    const city = searchInput.trim();

    if (city) {
      navigate(`/?city=${encodeURIComponent(city)}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setActiveFilter('all');
    navigate('/');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
      },
    },
  };

  return (
    <main className="crashr-home min-h-screen pb-20 pt-6 sm:pt-8">

      {/* Brand marquee */}
      <div className="home-marquee mb-12 overflow-hidden border-y py-3 sm:mb-16">
        <div className="home-marquee-track whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, index) => (
            <span
              key={index}
              className="home-marquee-copy"
              aria-hidden={index === 1 ? 'true' : undefined}
            >
              FIND YOUR PEOPLE&nbsp; • &nbsp;
              HOUSE PARTIES&nbsp; • &nbsp;
              GOOD MUSIC&nbsp; • &nbsp;
              NEW CONNECTIONS&nbsp; • &nbsp;
              NO BORING NIGHTS&nbsp; • &nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Hero */}
        <section className="home-hero mb-12 sm:mb-16">
          <div className="home-eyebrow mb-5">
            <span className="home-eyebrow-dot" />
            YOUR NEXT NIGHT STARTS HERE
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="home-title">
                {searchCity ? (
                  <>
                    Parties in
                    <br />
                    <span className="home-title-accent">
                      {searchCity}.
                    </span>
                  </>
                ) : (
                  <>
                    Find your
                    <br />
                    <span className="home-title-accent">
                      vibe.
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Discover house parties around you, meet
                new people, and find somewhere worth
                being tonight.
              </p>
            </div>

            <div className="home-search-panel">
              <p className="mb-3 text-sm font-bold text-stone-800">
                Where are we going?
              </p>

              <form
                onSubmit={submitSearch}
                className="home-search-form"
              >
                <MapPin
                  size={19}
                  className="shrink-0 text-amber-700"
                />

                <input
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  placeholder="Search party name or city..."
                  aria-label="Search parties by name or city"
                  className="home-search-input"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      navigate('/');
                    }}
                    className="home-clear-search"
                    aria-label="Clear city search"
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
                Find gatherings in the places you love.
              </p>
            </div>
          </div>
        </section>

        {/* Discovery controls */}
        <section className="mb-10" aria-label="Party filters">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Compass
                  size={19}
                  className="text-amber-700"
                />
                <h2 className="text-xl font-black tracking-tight text-stone-900 sm:text-2xl">
                  Explore the scene
                </h2>
              </div>

              <p className="mt-1 text-sm text-stone-500">
                Find the right place for your next night out.
              </p>
            </div>

            {searchCity && (
              <button
                type="button"
                onClick={clearSearch}
                className="home-reset-button"
              >
                <RotateCcw size={14} />
                Clear search
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value)
                }
                aria-pressed={
                  activeFilter === filter.value
                }
                className={`home-filter ${
                  activeFilter === filter.value
                    ? 'home-filter-active'
                    : ''
                }`}
              >
                {filter.value === 'tonight' && (
                  <CalendarDays size={15} />
                )}

                {filter.value === 'weekend' && (
                  <PartyPopper size={15} />
                )}

                {filter.value === 'budget' && (
                  <SlidersHorizontal size={15} />
                )}

                {filter.label}
              </button>
            ))}
            
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

      <span className="rounded- bg-orange-50 px-3 py-2 text-sm font-black text-orange-800">
        ₹{maxBudget}
      </span>
    </div>

    <input
      type="range"
      min="0"
      max="5000"
      step="100"
      value={maxBudget}
      onChange={(event) =>
        setMaxBudget(Number(event.target.value))
      }
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

          </div>
        </section>

        {/* Loading */}
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

            <span className="sr-only">
              Loading parties
            </span>
          </div>

        ) : error ? (
          /* Error state */
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
          /* No published parties */
          <div className="home-state-panel">
            <div className="home-state-icon">
              <PartyPopper size={26} />
            </div>

            <h2 className="text-2xl font-black text-stone-900">
              The scene is waiting for you.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              There are no parties to display yet.
              Be the first to create a gathering and
              bring your people together.
            </p>

            <div className="mt-6">
              <Button
                onClick={() => navigate('/create-party')}
                variant="rectangular"
                color="espresso"
              >
                Host a party
              </Button>
            </div>
          </div>

        ) : filteredParties.length === 0 ? (
          /* Filtered results empty */
          <div className="home-state-panel">
            <div className="home-state-icon">
              <MapPinOff size={26} />
            </div>

            <h2 className="text-2xl font-black text-stone-900">
              No parties found here. Yet.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-stone-600">
              {searchCity
              ? `We couldn't find parties matching "${searchCity}" with these filters. Try another search or explore all available parties.`
              : 'Nothing matches this filter right now. Try another date or explore all parties.'}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => {
                  setActiveFilter('all');
                  if (searchCity) clearSearch();
                }}
                variant="rectangular"
                color="espresso"
              >
                View all parties
              </Button>

              <Button
                onClick={() => navigate('/create-party')}
                variant="rectangular"
                color="white"
              >
                Host a party
              </Button>
            </div>
          </div>

        ) : (
          /* Party listings */
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
                        : searchCity
                          ? 'Around your area'
                          : 'Parties worth the night'}
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  {filteredParties.length}{' '}
                  {filteredParties.length === 1
                    ? 'party'
                    : 'parties'}{' '}
                  to explore
                  {searchCity ? ` in ${searchCity}` : ''}
                </p>
              </div>
              
<div className="flex items-center gap-2">
  <label
    htmlFor="party-sort"
    className="whitespace-nowrap text-sm font-bold text-stone-600"
  >
    Sort by
  </label>

  <select
    id="party-sort"
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
                      time: formatDateTime(
                        party.event_time || party.starts_at
                      ),
                      price: formatCurrency(party.price),
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Discovery footer */}
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
