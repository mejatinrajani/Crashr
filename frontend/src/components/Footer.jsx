import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Instagram,
  Twitter,
  Mail,
} from 'lucide-react';

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    Icon: Instagram,
    label: 'Visit Crashr on Instagram',
  },
  {
    name: 'X (Twitter)',
    href: '#',
    Icon: Twitter,
    label: 'Visit Crashr on X',
  },
  {
    name: 'Email',
    href: 'mailto:hello@crashr.app',
    Icon: Mail,
    label: 'Email Crashr',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full overflow-hidden border-t border-stone-900/10 bg-[#F8F5F0] text-stone-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-10">

        {/* Main footer columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1fr_0.8fr] lg:gap-12 xl:gap-16">

          {/* Brand and description */}
          <div className="min-w-0">
            <a
              href="/"
              aria-label="Crashr home"
              className="group inline-flex items-baseline"
            >
              <span className="text-[38px] font-black leading-none tracking-[-0.075em] text-stone-900 transition-colors duration-300 group-hover:text-stone-700 sm:text-[44px]">
                CRASHR
              </span>
              <span className="ml-1 text-[38px] font-black leading-none text-orange-600 transition-transform duration-300 group-hover:translate-x-0.5 sm:text-[44px]">
                .
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-stone-500 sm:text-[15px]">
              Find your crowd, discover your next party,
              and make nights worth remembering.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
              Explore
            </h3>

            <nav aria-label="Explore links" className="flex flex-col items-start gap-4">
              {[
                { label: 'Discover', href: '/' },
                { label: 'Find a Party', href: '/' },
                { label: 'Host a Party', href: '/create-party' },
                { label: 'My Tickets', href: '/tickets' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:text-orange-700"
                >
                  {item.label}
                  <ArrowUpRight
                    size={13}
                    aria-hidden="true"
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
              Support
            </h3>

            <nav aria-label="Support links" className="flex flex-col items-start gap-4">
              <a
                href="/help-center"
                className="text-sm font-semibold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Help Center
              </a>
              <a
                href="/contact"
                className="text-sm font-semibold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Contact Us
              </a>
              <a
                href="/privacy-policy"
                className="text-sm font-semibold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="text-sm font-semibold text-stone-700 transition-colors duration-200 hover:text-orange-700"
              >
                Terms of Service
              </a>
            </nav>
          </div>

          {/* Stay Connected */}
          <div className="min-w-0 lg:border-l lg:border-stone-900/15 lg:pl-7 xl:pl-10">
            <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
              Stay Connected
            </h3>

            <div className="flex flex-col items-start gap-3">
              {socialLinks.map(({ name, href, Icon, label }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={label}
                  title={name}
                  className="group flex h-12 w-12 items-center overflow-hidden rounded-full border border-orange-900/10 bg-[#FFF9F1] text-stone-800 shadow-[0_3px_10px_rgba(41,37,36,0.05)] transition-[width,background-color,border-color,box-shadow] duration-300 ease-out hover:w-44 hover:border-orange-700/20 hover:bg-[#F1E5D5] hover:shadow-[0_6px_18px_rgba(41,37,36,0.09)] focus-visible:w-44 focus-visible:border-orange-700/30 focus-visible:bg-[#F1E5D5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:h-12 sm:w-12"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </span>

                  <span className="whitespace-nowrap pr-4 text-sm font-bold opacity-0 transition-opacity delay-75 duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {name}
                  </span>

                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="mr-3 ml-auto shrink-0 text-orange-700 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Oversized full-width wordmark */}
        <div className="mt-12 border-b border-stone-900/70 pb-2 pt-6 sm:mt-16 sm:pt-8 lg:mt-20">
          <a
            href="/"
            aria-label="Crashr home"
            className="group block w-full overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="w-full whitespace-nowrap text-center text-[19vw] font-black leading-[0.82] tracking-[-0.085em] text-transparent bg-clip-text transition-all duration-500 group-hover:tracking-[-0.075em]"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #292524 0%, #292524 45%, #D8C6AF 100%)',
              }}
            >
              CRASHR<span className="text-orange-600">.</span>
            </div>
          </a>
        </div>

        {/* Copyright and tagline */}
        <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-stone-400 sm:text-[10px]">
            © {currentYear} CRASHR. All rights reserved.
          </p>

          <p className="text-[11px] font-medium text-stone-500 sm:text-right">
            Find your crowd. Make the night count.
          </p>
        </div>
      </div>
    </footer>
  );
}
