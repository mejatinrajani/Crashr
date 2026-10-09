
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";

const sections = [
  {
    id: "eligibility",
    title: "1. Eligibility and accounts",
    paragraphs: [
      "You may use Crashr only if you are legally eligible to do so and meet the minimum age and other requirements applicable to the platform and the event you wish to attend.",
      "You are responsible for providing accurate account information, maintaining the security of your credentials, and activity conducted through your account, subject to applicable law.",
      "Do not impersonate another person, create accounts for fraudulent purposes, or attempt to access accounts or information without authorization.",
    ],
  },
  {
    id: "service",
    title: "2. How Crashr works",
    paragraphs: [
      "Crashr provides features that may allow users to discover parties, view event details, request tickets, manage guest lists, and host events.",
      "The features available to you may depend on your account status, the event settings, and the platform's current functionality. We may update, improve, suspend, or discontinue features where reasonably necessary and subject to applicable law.",
      "Crashr's role in a booking, event, or payment depends on the specific flow and arrangements presented to users. Do not assume that the platform itself is the event host, venue operator, or payment recipient unless the relevant information says so.",
    ],
  },
  {
    id: "hosting",
    title: "3. Responsibilities of hosts",
    paragraphs: [
      "Hosts are responsible for ensuring that their event descriptions, dates, times, prices, capacity, and location information are accurate and kept up to date.",
      "Hosts must have the necessary authority and permissions to organize their events, comply with applicable laws and venue requirements, and avoid misleading guests about what is offered.",
      "Hosts should manage ticket requests fairly, communicate material changes promptly, and handle guest information responsibly. Do not publish private addresses or other sensitive information without appropriate authority.",
    ],
  },
  {
    id: "tickets",
    title: "4. Ticket requests and approvals",
    paragraphs: [
      "Submitting a ticket request does not by itself guarantee admission. A request may remain pending while the host reviews it, and the host may accept or decline requests according to the event's stated settings and applicable law.",
      "Where payment is required, approval and successful payment may be separate steps. Check the status displayed by Crashr and retain any relevant confirmation.",
      "You must not resell, transfer, or misuse a ticket in a way that violates the event's stated conditions or applicable law.",
    ],
  },
  {
    id: "payments",
    title: "5. Payments, fees, and refunds",
    paragraphs: [
      "Prices, applicable fees, payment steps, and any refund conditions should be reviewed before you complete a transaction. The specific event terms and checkout information may apply to your booking.",
      "Payment processing may involve third-party providers. Their terms and privacy notices may apply to the payment service they provide.",
      "Refund eligibility depends on the applicable event conditions, cancellation circumstances, payment arrangements, and relevant law. Do not assume every booking is refundable. Where a transaction appears incorrect, contact support with the relevant reference rather than repeatedly attempting payment.",
    ],
  },
  {
    id: "conduct",
    title: "6. Acceptable use",
    paragraphs: [
      "You agree not to use Crashr to harass, threaten, exploit, defraud, or discriminate against others; distribute unlawful content; publish knowingly misleading event information; or facilitate illegal activity.",
      "You must not interfere with the platform, bypass security or access controls, misuse another person's information, manipulate booking or payment flows, or introduce malicious code.",
      "Respect the privacy, boundaries, and safety of other attendees. Users remain responsible for their own conduct and for complying with venue rules and applicable law.",
    ],
  },
  {
    id: "safety",
    title: "7. Safety and event changes",
    paragraphs: [
      "Review event information carefully before attending. Hosts should communicate cancellations, changes of venue, and other material updates as promptly as reasonably possible.",
      "Crashr cannot guarantee the conduct of every user, the safety of every venue, or the accuracy of every user-submitted listing. We may review reports and take appropriate action within our authority, but users should exercise their own judgment.",
      "If you face immediate danger, contact local emergency services. Do not rely on a website support request as an emergency response service.",
    ],
  },
  {
    id: "content",
    title: "8. User-submitted content",
    paragraphs: [
      "You retain rights you hold in content you submit, subject to rights and permissions you grant to operate the service.",
      "By submitting content, you represent that you have the rights needed to share it and grant Crashr the limited permissions necessary to host, display, and process that content in connection with the platform and its features.",
      "Do not submit content that infringes another person's rights, violates the law, or exposes private information without authorization.",
    ],
  },
  {
    id: "suspension",
    title: "9. Restrictions and account suspension",
    paragraphs: [
      "Where permitted by law, Crashr may restrict access to features, remove content, or suspend an account when there is a reasonable basis to address suspected fraud, abuse, security threats, serious policy violations, or legal obligations.",
      "Where appropriate, we may request additional information to investigate a reported issue. Any review or appeal process will depend on the procedures available at the time.",
      "Nothing in these terms removes rights that cannot lawfully be excluded or limited.",
    ],
  },
  {
    id: "liability",
    title: "10. Disclaimers and liability",
    paragraphs: [
      "Crashr is provided subject to applicable law and the availability of the relevant service. We aim to keep the platform reliable, but cannot promise uninterrupted operation or that every listing and user-provided detail is error-free.",
      "To the extent permitted by law, any limitations of liability must be interpreted consistently with mandatory consumer protections and other non-excludable rights. Nothing in these terms is intended to exclude liability where doing so would be unlawful.",
      "Users and hosts remain responsible for obligations that applicable law places on them in connection with their own conduct and events.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to these terms",
    paragraphs: [
      "We may revise these terms as Crashr evolves or legal requirements change. Updated terms should be published on this page with an appropriate revision or effective date.",
      "Where notice or consent is legally required for a material change, we will follow the applicable requirements. Continued use does not override rights you may have under applicable law.",
    ],
  },
  {
    id: "law",
    title: "12. Governing law and contact",
    paragraphs: [
      "Any governing-law, jurisdiction, or dispute-resolution provisions must be finalized by the operator of Crashr based on its legal structure, operating locations, and applicable consumer laws.",
      "For questions about these terms, a booking, or platform conduct, use the Contact Us page to reach the Crashr team.",
    ],
  },
];

export default function TermsOfService() {
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
              <CheckCircle2 size={15} /> Clear expectations
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Terms of
              <span className="text-[#D97706]"> service.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#78716C] sm:text-base">
              The ground rules for using Crashr, creating parties, requesting
              tickets, and connecting with other people.
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
            Contents
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
              Need clarification about a booking or these terms?
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
                icon: Users,
                title: "Respect everyone",
                text: "Use the platform responsibly.",
              },
              {
                icon: CalendarCheck,
                title: "Know your booking",
                text: "Understand requests and confirmations.",
              },
              {
                icon: CreditCard,
                title: "Check payment terms",
                text: "Review the details before paying.",
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
              <ShieldCheck className="mt-0.5 shrink-0 text-[#B45309]" size={20} />
              <div>
                <h2 className="text-sm font-bold">
                  Please read before using Crashr
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#78716C]">
                  These terms are a product-specific draft, not a substitute
                  for legal review. The final version should identify the
                  operating entity, applicable law, cancellation rules,
                  payment arrangements, and any event-specific conditions.
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
            <h2 className="text-xl font-black">
              Ready to make your next plan?
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Explore Crashr and make sure you understand the details of
              each party before requesting a spot.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#B45309]"
            >
              Explore Crashr <ArrowUpRight size={16} />
            </Link>
          </div>
        </article>
      </section>

      <footer className="border-t border-[#292524]/5 px-5 py-6 text-center text-xs text-[#78716C]">
        <Link to="/help-center" className="hover:text-[#D97706]">
          Help Center
        </Link>
        <span className="mx-3">·</span>
        <Link to="/privacy-policy" className="hover:text-[#D97706]">
          Privacy policy
        </Link>
      </footer>
    </main>
  );
}
