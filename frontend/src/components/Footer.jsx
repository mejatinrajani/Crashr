import {
  ArrowUpRight,
  Instagram,
  Twitter,
  Mail,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full border-t border-stone-900/0.08 bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        {/* Main footer content */}
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-20">

          {/* ================================================== */}
          {/* BRAND */}
          {/* ================================================== */}

          <div className="max-w-md">

            <a
              href="/"
              aria-label="Crashr home"
              className="group inline-flex items-baseline"
            >
              <span className="text-[38px] font-black leading-none tracking-[-0.075em] text-stone-900 transition-colors duration-200 group-hover:text-orange-700 sm:text-[44px]">
                CRASHR
              </span>

              <span className="ml-1 text-[38px] font-black leading-none text-orange-600 transition-transform duration-200 group-hover:translate-x-0.5 sm:text-[44px]">
                .
              </span>
            </a>

            <p className="mt-5 max-w-sm text-[15px] font-medium leading-7 text-stone-500">
              Find your crowd, discover your next party,
              and make nights worth remembering.
            </p>

            {/* Social / contact */}
            <div className="mt-7 flex items-center gap-3">

              <a
                href="#"
                aria-label="Crashr on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-stone-900/10 bg-white text-stone-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:text-orange-600 hover:shadow-md"
              >
                <Instagram size={17} />
              </a>

              <a
                href="#"
                aria-label="Crashr on X"
                className="grid h-10 w-10 place-items-center rounded-full border border-stone-900/10 bg-white text-stone-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:text-orange-600 hover:shadow-md"
              >
                <Twitter size={17} />
              </a>

              <a
                href="mailto:hello@crashr.app"
                aria-label="Email Crashr"
                className="grid h-10 w-10 place-items-center rounded-full border border-stone-900/10 bg-white text-stone-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:text-orange-600 hover:shadow-md"
              >
                <Mail size={17} />
              </a>

            </div>
          </div>

          {/* ================================================== */}
          {/* QUICK LINKS */}
          {/* ================================================== */}

          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-stone-400">
              Explore
            </h3>

            <nav className="flex flex-col items-start gap-3.5">

              <a
                href="/"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Discover
                <ArrowUpRight
                  size={13}
                  className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </a>

              <a
                href="/"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Find a Party
                <ArrowUpRight
                  size={13}
                  className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </a>

              <a
                href="/create-party"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Host a Party
                <ArrowUpRight
                  size={13}
                  className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </a>

              <a
                href="/tickets"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                My Tickets
                <ArrowUpRight
                  size={13}
                  className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </a>

            </nav>
          </div>

          {/* ================================================== */}
          {/* SUPPORT */}
          {/* ================================================== */}

          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-stone-400">
              Support
            </h3>

            <nav className="flex flex-col items-start gap-3.5">

              <a
                href="#"
                className="text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Help Center
              </a>

              <a
                href="mailto:support@crashr.app"
                className="text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Contact Us
              </a>

              <a
                href="#"
                className="text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-sm font-bold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Terms of Service
              </a>

            </nav>
          </div>
        </div>

        {/* ================================================== */}
        {/* BOTTOM BAR */}
        {/* ================================================== */}

        <div className="mt-12 flex flex-col gap-4 border-t border-stone-900/0.08 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
            © {currentYear} CRASHR. All rights reserved.
          </p>

          <p className="text-[11px] font-semibold text-stone-400">
            Find your crowd. Make the night count.
          </p>

        </div>
      </div>
    </footer>
  );
}