
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  ShieldCheck,
  Database,
  MapPin,
  UserRound,
} from "lucide-react";

const sections = [
  {
    id: "information",
    title: "1. Information we may collect",
    paragraphs: [
      "When you create or use a Crashr account, we may process information such as your name, email address, profile details, and authentication-related account identifiers.",
      "When you browse, request tickets, host parties, or manage bookings, information associated with those activities may include party details, ticket status, guest-list information, transaction references, and communications you submit to us.",
      "Technical information such as browser details, device information, security logs, and usage events may also be processed where necessary for platform operation, troubleshooting, and security.",
    ],
  },
  {
    id: "usage",
    title: "2. How we use your information",
    paragraphs: [
      "We use information to operate Crashr, maintain your account, display party listings, manage ticket requests, support hosts and guests, and provide relevant booking information.",
      "We may also use necessary information to troubleshoot errors, protect accounts, investigate suspected abuse, comply with applicable legal obligations, and improve the reliability of our services.",
      "We do not claim to use information for a purpose simply because it is technically possible. Processing should be limited to purposes that are disclosed, appropriate, and permitted by applicable law.",
    ],
  },
  {
    id: "parties",
    title: "3. Parties, profiles, and visibility",
    paragraphs: [
      "Information you place in a party listing or public-facing profile may be visible to other users. Consider this before publishing your name, biography, photos, event description, or general location.",
      "Crashr may distinguish between a public event location and more sensitive venue details. Do not assume that an address or other detail is hidden unless the interface clearly indicates that restriction and the backend enforces it.",
      "Hosts and guests should only share information necessary to arrange an event and should respect other users' privacy.",
    ],
  },
  {
    id: "location",
    title: "4. Location information",
    paragraphs: [
      "Party listings may contain location information supplied by their hosts. If a future or current feature requests your device location, that information should be used only as described in the relevant permission prompt and applicable privacy notice.",
      "You can manage device-level location permissions through your browser or operating system. Disabling a permission may limit features that depend on it.",
      "This notice must be updated if Crashr introduces precise geolocation, background location collection, or additional location-based discovery features.",
    ],
  },
  {
    id: "sharing",
    title: "5. When information may be shared",
    paragraphs: [
      "Information may be made available to other users when necessary for a feature you choose to use, such as showing a host information relevant to a ticket request.",
      "We may rely on service providers that support hosting, authentication, databases, payment processing, security, or customer support. Their access should be limited to what is needed for their role and governed by applicable agreements.",
      "Information may also be disclosed where required by law, to address security incidents, or to protect the rights and safety of users, subject to applicable legal requirements.",
    ],
  },
  {
    id: "security",
    title: "6. Data security",
    paragraphs: [
      "We aim to use appropriate technical and organizational measures to protect information against unauthorized access, alteration, disclosure, or loss.",
      "Crashr's architecture may use Supabase for authentication and data storage. Actual protections depend on production configuration, database access policies, server permissions, secret management, and the controls applied to every relevant table and endpoint.",
      "No internet-based service can guarantee absolute security. Keep your login credentials private and notify us if you suspect unauthorized access.",
    ],
  },
  {
    id: "retention",
    title: "7. Data retention and deletion",
    paragraphs: [
      "We retain information for as long as reasonably necessary for the purposes described in this notice, including account operation, booking records, security, dispute resolution, and legal compliance.",
      "You may request access to, correction of, or deletion of eligible personal information, subject to applicable law and legitimate retention requirements.",
      "Deleting an account may not immediately remove every record from backups, transaction systems, or records that must be retained. The actual deletion process and timelines should be documented by the service operator.",
    ],
  },
  {
    id: "rights",
    title: "8. Your choices and rights",
    paragraphs: [
      "Depending on your location and applicable law, you may have rights to access, correct, delete, or obtain a copy of your personal information, withdraw certain permissions, or object to particular processing.",
      "You can review the information you provide through your account settings where those controls are available. For requests that cannot be handled in the interface, contact Crashr through the Contact Us page.",
    ],
  },
  {
    id: "children",
    title: "9. Age and eligibility",
    paragraphs: [
      "Crashr is intended for people who meet the minimum age required by applicable law and the platform's eligibility rules. Do not create an account or use restricted features if you are not eligible.",
      "If you believe a person who is not eligible has provided personal information to Crashr, contact the platform so the situation can be reviewed.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to this policy",
    paragraphs: [
      "We may update this notice as Crashr's features, technical architecture, or legal obligations change. Material updates should be reflected by a revised effective date and communicated where required.",
      "Please review this page periodically to understand the privacy practices that apply to your use of the platform.",
    ],
  },
];

export default function Privacypolicy() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#292524]">
      <section className="border-b border-[#292524]/5 bg-[#F8F1E7]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#78716C] transition hover:text-[#D97706]"
          >
            <ArrowLeft size={15} /> Back to Crashr
          </Link>

          <div className="mt-9 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B45309]">
              <ShieldCheck size={15} /> Your privacy matters
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Privacy
              <span className="text-[#D97706]"> policy.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#78716C] sm:text-base">
              A clear explanation of the information Crashr may handle
              when you create an account, discover parties, request tickets,
              or host an event.
            </p>

            <p className="mt-5 text-xs font-medium text-[#A8A29E]">
              Draft for review · Effective date to be confirmed
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <aside className="h-fit rounded-2xl border border-[#292524]/10 bg-white p-5 lg:sticky lg:top-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97706]">
            On this page
          </p>

          <nav className="mt-4 space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2.5 text-xs font-medium leading-5 text-[#78716C] transition hover:bg-[#F5EBDD] hover:text-[#292524]"
              >
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-5 border-t border-[#292524]/5 pt-5">
            <p className="text-xs leading-6 text-[#78716C]">
              Have a privacy question or a data request?
            </p>
            <Link
              to="/contact"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#D97706] hover:text-[#92400E]"
            >
              Contact us <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: LockKeyhole,
                title: "Account protection",
                text: "Access controls and security measures.",
              },
              {
                icon: Database,
                title: "Data transparency",
                text: "Understand how information is used.",
              },
              {
                icon: UserRound,
                title: "Your choices",
                text: "Review your information and rights.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#292524]/5 bg-white p-4"
              >
                <Icon className="text-[#D97706]" size={21} />
                <h2 className="mt-4 text-sm font-bold">{title}</h2>
                <p className="mt-1 text-xs leading-6 text-[#78716C]">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-8 rounded-2xl border border-[#D97706]/15 bg-[#D97706]/5 p-5">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 shrink-0 text-[#B45309]" size={20} />
              <div>
                <h2 className="text-sm font-bold">A note about location</h2>
                <p className="mt-2 text-sm leading-7 text-[#78716C]">
                  Party locations and device location permissions are
                  different things. Review the sections below to understand
                  how each may be handled.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 border-b border-[#292524]/10 pb-9 last:border-0"
              >
                <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-8 text-[#78716C]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-[#292524] p-6 text-[#FDFBF7] sm:p-8">
            <h2 className="text-xl font-black">Questions about your data?</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Contact the Crashr team to ask about privacy, account
              information, or an eligible data request.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#B45309]"
            >
              Contact Crashr <ArrowUpRight size={16} />
            </Link>
          </div>
        </article>
      </section>

      <footer className="border-t border-[#292524]/5 px-5 py-6 text-center text-xs text-[#78716C]">
        <Link to="/help-center" className="hover:text-[#D97706]">
          Help Center
        </Link>
        <span className="mx-3">·</span>
        <Link to="/terms-of-service" className="hover:text-[#D97706]">
          Terms of service
        </Link>
      </footer>
    </main>
  );
}
