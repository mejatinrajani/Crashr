
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Ticket,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  UserRound,
  MessageCircle,
  ChevronDown,
  LifeBuoy,
  Sparkles,
  Mail,
} from "lucide-react";

const categories = [
  { name: "All questions", icon: Sparkles },
  { name: "Tickets & parties", icon: Ticket },
  { name: "Payments", icon: CreditCard },
  { name: "Account", icon: UserRound },
  { name: "Safety", icon: ShieldCheck },
];

const faqs = [
  {
    category: "Tickets & parties",
    question: "How do I join a party on Crashr?",
    answer:
      "Browse upcoming parties and open one to view its details. Select Request Ticket to submit your request. If the host requires approval, wait for their decision. Once approved, follow the payment instructions shown on the party page to confirm your spot.",
  },
  {
    category: "Tickets & parties",
    question: "Why is my ticket request still pending?",
    answer:
      "Some hosts review requests before accepting guests. Your request remains pending until the host makes a decision. Check your dashboard or ticket status for updates.",
  },
  {
    category: "Tickets & parties",
    question: "How can I host a party?",
    answer:
      "Sign in to your Crashr account and use the party creation flow to add a title, description, date, location, capacity, price, and cover image. Review your details before publishing. Make sure your event information is accurate and your venue arrangements are in place.",
  },
  {
    category: "Tickets & parties",
    question: "Can I manage my guest list?",
    answer:
      "If you are the host, open your dashboard to manage your party and guest requests. Available actions depend on your party status and the features enabled on your account.",
  },
  {
    category: "Payments",
    question: "When is my place confirmed?",
    answer:
      "A request or approval does not necessarily mean your place is confirmed. If payment is required, complete the payment flow and check your ticket status for confirmation.",
  },
  {
    category: "Payments",
    question: "What if my payment fails?",
    answer:
      "Check your payment method, available balance, and internet connection before trying again. If money was deducted but your ticket is not confirmed, avoid repeated payments and contact support with your transaction details. Never share your password or payment PIN.",
  },
  {
    category: "Payments",
    question: "Can I get a refund?",
    answer:
      "Refund eligibility depends on the applicable event terms, cancellation circumstances, and payment arrangements. Review the terms associated with your booking and contact support for assistance. A refund is not guaranteed in every situation.",
  },
  {
    category: "Account",
    question: "How do I update my profile?",
    answer:
      "Sign in and open your profile or account settings. Update the information available there and save your changes. If you cannot access your account, use the available account recovery options.",
  },
  {
    category: "Account",
    question: "What should I do if I cannot sign in?",
    answer:
      "Verify that you are using the correct account credentials and check your internet connection. If authentication is still failing, use the available recovery flow or contact support. Never send your password to anyone.",
  },
  {
    category: "Safety",
    question: "How does Crashr help keep users safe?",
    answer:
      "Review party details carefully, communicate respectfully, and share personal information only when necessary. Hosts should provide accurate event information. If you encounter suspicious activity or feel unsafe, contact the platform and seek local emergency assistance when necessary.",
  },
  {
    category: "Safety",
    question: "What information should I share with a host?",
    answer:
      "Share only the information needed to coordinate your attendance. Do not disclose passwords, authentication codes, payment PINs, or other sensitive credentials. Check event details before travelling to an unfamiliar venue.",
  },
  {
    category: "Safety",
    question: "How do I report a problem with a party?",
    answer:
      "Contact Crashr support with the party details, a description of the issue, and relevant evidence that you are comfortable sharing. For immediate danger, contact local emergency services rather than waiting for an online response.",
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All questions");
  const [openFaq, setOpenFaq] = useState(0);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All questions" ||
        faq.category === activeCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#292524]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#292524]/5">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#D97706]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#E7D8C3]/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-[#D97706]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B45309]">
              <LifeBuoy size={15} />
              Crashr support
            </span>

            <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-6xl">
              A little help for
              <span className="block text-[#D97706]">your next big plan.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#78716C] sm:text-base">
              Questions about joining a party, hosting an event, or managing
              your tickets? Find the answers you need right here.
            </p>

            <div className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#292524]/10 bg-white px-4 py-2 shadow-[0_12px_40px_rgba(41,37,36,0.06)] focus-within:border-[#D97706]/60">
              <Search className="shrink-0 text-[#A8A29E]" size={21} />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setOpenFaq(-1);
                }}
                placeholder="Search tickets, payments, accounts..."
                aria-label="Search help articles"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#A8A29E]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-bold text-[#D97706] hover:text-[#92400E]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support categories */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map(({ name, icon: Icon }) => {
            const selected = activeCategory === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setActiveCategory(name);
                  setOpenFaq(-1);
                }}
                className={`group flex min-h-28 flex-col items-start justify-between rounded-2xl border p-4 text-left transition duration-200 sm:p-5 ${
                  selected
                    ? "border-[#292524] bg-[#292524] text-[#FDFBF7] shadow-lg shadow-[#292524]/10"
                    : "border-[#292524]/10 bg-white hover:-translate-y-0.5 hover:border-[#D97706]/40 hover:shadow-md"
                }`}
              >
                <span
                  className={`rounded-xl p-2 ${
                    selected
                      ? "bg-[#D97706] text-white"
                      : "bg-[#F5EBDD] text-[#B45309]"
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span className="mt-4 text-xs font-bold sm:text-sm">
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ list */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D97706]">
                Find your answer
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Frequently asked questions
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-[#F5EBDD] px-3 py-1.5 text-xs font-bold text-[#78716C]">
              {filteredFaqs.length} articles
            </span>
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <article
                    key={faq.question}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isOpen
                        ? "border-[#D97706]/30 bg-white shadow-sm"
                        : "border-[#292524]/10 bg-white hover:border-[#292524]/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                    >
                      <span>
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#D97706]">
                          {faq.category}
                        </span>
                        <span className="text-sm font-bold leading-6 sm:text-base">
                          {faq.question}
                        </span>
                      </span>

                      <span
                        className={`shrink-0 rounded-full p-2 transition ${
                          isOpen
                            ? "rotate-180 bg-[#D97706]/10 text-[#D97706]"
                            : "bg-[#F5EBDD] text-[#78716C]"
                        }`}
                      >
                        <ChevronDown size={18} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6">
                        <div className="mb-4 h-px bg-[#292524]/5" />
                        <p className="text-sm leading-7 text-[#78716C]">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#292524]/15 bg-white px-6 py-16 text-center">
              <Search className="mx-auto text-[#D97706]" size={30} />
              <h3 className="mt-4 text-lg font-bold">No answers found</h3>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                Try another search term or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All questions");
                  setOpenFaq(0);
                }}
                className="mt-5 text-sm font-bold text-[#D97706] hover:text-[#92400E]"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#292524] p-7 text-[#FDFBF7] sm:p-12">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#D97706]/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FBBF77]">
                <MessageCircle size={16} />
                Still need a hand?
              </span>
              <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                We’re here to help you figure it out.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Tell us what happened, and include the relevant party or
                ticket details so the team can understand your issue.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D97706] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#B45309]"
            >
              Contact support <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-[#78716C]">
          <Link
            to="/privacy-policy"
            className="transition hover:text-[#D97706]"
          >
            Privacy policy
          </Link>
          <Link
            to="/terms-of-service"
            className="transition hover:text-[#D97706]"
          >
            Terms of service
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 transition hover:text-[#D97706]"
          >
            <Mail size={14} /> Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
