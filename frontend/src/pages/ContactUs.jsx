
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LifeBuoy,
  MessageCircle,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  category: "General question",
  subject: "",
  message: "",
};

const supportOptions = [
  "General question",
  "Ticket or party request",
  "Payment issue",
  "Hosting a party",
  "Account or sign-in",
  "Safety concern",
  "Bug report",
];

export default function ContactUs() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Please add a subject.";
    }

    if (form.message.trim().length < 10) {
      nextErrors.message = "Please provide at least 10 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      // Connect this validated payload to your support API here.
      // Do not show a sent confirmation until the API succeeds.
      setSubmitted(true);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#292524]/10 bg-[#FDFBF7] px-4 py-3.5 text-sm text-[#292524] outline-none transition placeholder:text-[#A8A29E] focus:border-[#D97706]/60 focus:ring-2 focus:ring-[#D97706]/10";

  const labelClass = "text-sm font-bold text-[#44403C]";

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#292524]">
      <section className="border-b border-[#292524]/5 bg-[#F8F1E7]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            to="/help-center"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#78716C] transition hover:text-[#D97706]"
          >
            <ArrowLeft size={15} /> Back to Help Center
          </Link>

          <div className="mt-9 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B45309]">
              <MessageCircle size={15} /> Contact Crashr
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Let’s get things
              <span className="block text-[#D97706]">sorted out.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#78716C] sm:text-base">
              Whether you need help with a ticket, a party you’re hosting,
              or your account, tell us what’s going on.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-16">
        {/* Information panel */}
        <aside>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D97706]">
            How can we help?
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Your plans matter to us.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#78716C]">
            Give us enough detail to understand the situation. If your
            message concerns a booking, include the relevant party or
            transaction reference where available.
          </p>

          <div className="mt-8 space-y-4">
            {[
              {
                icon: Ticket,
                title: "Tickets & parties",
                description:
                  "Questions about requests, approvals, or event details.",
              },
              {
                icon: ShieldCheck,
                title: "Account & safety",
                description:
                  "Help with access, privacy, or a concern about an event.",
              },
              {
                icon: LifeBuoy,
                title: "Something not working?",
                description:
                  "Describe the error and the steps that led to it.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-[#292524]/5 bg-white p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5EBDD] text-[#B45309]">
                  <Icon size={21} />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-xs leading-6 text-[#78716C]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#D97706]/15 bg-[#D97706]/5 p-5">
            <p className="text-sm font-bold">A quick tip</p>
            <p className="mt-2 text-xs leading-6 text-[#78716C]">
              Never include your password, authentication code, card PIN,
              or other sensitive credentials in a support message.
            </p>
          </div>
        </aside>

        {/* Contact form */}
        <div className="rounded-3xl border border-[#292524]/10 bg-white p-6 shadow-[0_16px_60px_rgba(41,37,36,0.05)] sm:p-9">
          {submitted ? (
            <div className="py-12 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D97706]/10 text-[#D97706]">
                <CheckCircle2 size={32} />
              </span>
              <h2 className="mt-6 text-2xl font-black">
                Your details look good.
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#78716C]">
                The form has been validated, but no message has been sent
                yet. Connect the support API to complete submission.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setErrors({});
                  setSubmitted(false);
                }}
                className="mt-7 rounded-xl bg-[#292524] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#44403C]"
              >
                Write another message
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-black sm:text-2xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-[#78716C]">
                  Fields marked with * are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Your name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      placeholder="How should we address you?"
                      className={inputClass}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateField}
                      placeholder="you@example.com"
                      className={inputClass}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-category" className={labelClass}>
                    What do you need help with? *
                  </label>
                  <select
                    id="contact-category"
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className={inputClass}
                  >
                    {supportOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-subject" className={labelClass}>
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={updateField}
                    placeholder="Briefly describe your issue"
                    className={inputClass}
                    aria-invalid={Boolean(errors.subject)}
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Your message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    maxLength={3000}
                    value={form.message}
                    onChange={updateField}
                    placeholder="Tell us what happened and what you need help with..."
                    className={`${inputClass} resize-y`}
                    aria-invalid={Boolean(errors.message)}
                  />
                  <div className="mt-1.5 flex justify-between gap-3">
                    {errors.message ? (
                      <p className="text-xs text-red-600">
                        {errors.message}
                      </p>
                    ) : (
                      <span className="text-xs text-[#A8A29E]">
                        Please avoid sharing sensitive credentials.
                      </span>
                    )}
                    <span className="shrink-0 text-xs text-[#A8A29E]">
                      {form.message.length}/3000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97706] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#B45309] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:ring-offset-2"
                >
                  Submit message <ArrowRight size={17} />
                </button>

                <p className="text-center text-xs leading-6 text-[#A8A29E]">
                  Submitting this form does not transmit your message until
                  the support submission service is connected.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-[#292524]/5 px-5 py-6 text-center text-xs text-[#78716C]">
        <Link to="/privacy-policy" className="hover:text-[#D97706]">
          Privacy policy
        </Link>
        <span className="mx-3">·</span>
        <Link to="/terms-of-service" className="hover:text-[#D97706]">
          Terms of service
        </Link>
      </footer>
    </main>
  );
}
