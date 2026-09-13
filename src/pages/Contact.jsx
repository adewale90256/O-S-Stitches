import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  occasion: "",
  message: "",
};

const services = [
  "Agbada",
  "Traditional Wear",
  "Ceremonial Wear",
  "Custom Design",
  "Other",
];

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);

    // ========================================================
    // FIREBASE TODO
    // --------------------------------------------------------
    // Replace this temporary submission with a Firebase
    // Firestore addDoc() call.
    //
    // Example future structure:
    //
    // await addDoc(collection(db, "enquiries"), {
    //   ...form,
    //   status: "new",
    //   createdAt: serverTimestamp(),
    // });
    // ========================================================

    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitting(false);
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="bg-[#f8f6f0] text-[#06151b]">
      {/* ======================================================
          HERO
      ======================================================= */}
      <section className="bg-[#06151b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d7ad55]">
              Contact O-S Stitches
            </p>

            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Let&apos;s create something made for you.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Tell us what you have in mind and let&apos;s discuss your next
              custom piece, occasion, or design.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT CONTENT
      ======================================================= */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-24">
          {/* ==================================================
              LEFT — CONTACT INFORMATION
          =================================================== */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b58a32]">
              Get in touch
            </p>

            <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight sm:text-4xl">
              We&apos;d love to hear from you.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Whether you already have a design in mind or need help bringing an
              idea together, send us a message and we&apos;ll take it from
              there.
            </p>

            {/* Contact details */}
            <div className="mt-10 space-y-6">
              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white">
                  <Phone
                    size={16}
                    strokeWidth={1.6}
                    className="text-[#b58a32]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    +234 000 000 0000
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Temporary contact information
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white">
                  <Mail
                    size={16}
                    strokeWidth={1.6}
                    className="text-[#b58a32]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    info@osstitches.com
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Temporary email address
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white">
                  <MapPin
                    size={16}
                    strokeWidth={1.6}
                    className="text-[#b58a32]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-700">Lagos, Nigeria</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Exact studio location to be provided
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-white">
                  <Clock3
                    size={16}
                    strokeWidth={1.6}
                    className="text-[#b58a32]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Business hours
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                    <p>Saturday: 10:00 AM – 4:00 PM</p>
                    <p>Sunday: By appointment</p>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Temporary business hours
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-10 border border-[#d7ad55]/30 bg-white p-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
                Prefer WhatsApp?
              </p>

              <h3 className="mt-2 font-serif text-xl">
                Start your enquiry directly.
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                For a quicker conversation, you can contact O-S STITCHES
                directly on WhatsApp.
              </p>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90"
              >
                <MessageCircle size={15} />
                Chat on WhatsApp
              </a>

              <p className="mt-3 text-[9px] text-slate-400">
                WhatsApp number will be connected when provided.
              </p>
            </div>

            {/* Social */}
            <div className="mt-8 flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                Follow us
              </span>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-500 transition hover:border-[#d7ad55] hover:text-[#b58a32]"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-xs font-semibold text-slate-500 transition hover:border-[#d7ad55] hover:text-[#b58a32]"
              >
                f
              </a>
            </div>
          </div>

          {/* ==================================================
              RIGHT — ENQUIRY FORM
          =================================================== */}
          <div className="border border-slate-200 bg-white p-6 sm:p-8 lg:p-10">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
                Enquiry form
              </p>

              <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                Tell us about your project.
              </h2>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                The more information you provide, the easier it is for us to
                understand what you&apos;re looking for.
              </p>
            </div>

            {submitted ? (
              /* =================================================
                 SUCCESS STATE
              ================================================== */
              <div className="flex min-h-125 flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                  <CheckCircle2
                    size={27}
                    strokeWidth={1.5}
                    className="text-emerald-600"
                  />
                </div>

                <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
                  Enquiry received
                </p>

                <h3 className="mt-3 font-serif text-3xl">
                  Thank you for reaching out.
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                  Your enquiry has been recorded. We&apos;ll get back to you as
                  soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 inline-flex items-center gap-2 border border-[#06151b] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#06151b] transition hover:bg-[#06151b] hover:text-white"
                >
                  Send another enquiry
                  <ArrowRight size={14} strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-7">
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-2 h-11 w-full border border-slate-200 bg-[#faf9f6] px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#d7ad55]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-2 h-11 w-full border border-slate-200 bg-[#faf9f6] px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#d7ad55]"
                    />
                  </div>
                </div>

                {/* Phone + Service */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      className="mt-2 h-11 w-full border border-slate-200 bg-[#faf9f6] px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#d7ad55]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                    >
                      What do you need?
                    </label>

                    <select
                      id="service"
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full border border-slate-200 bg-[#faf9f6] px-3 text-sm text-slate-700 outline-none transition focus:border-[#d7ad55]"
                    >
                      <option value="">Select a service</option>

                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Occasion */}
                <div className="mt-5">
                  <label
                    htmlFor="occasion"
                    className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    Occasion / event
                  </label>

                  <input
                    id="occasion"
                    name="occasion"
                    type="text"
                    value={form.occasion}
                    onChange={handleChange}
                    placeholder="Wedding, ceremony, birthday, personal wear..."
                    className="mt-2 h-11 w-full border border-slate-200 bg-[#faf9f6] px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#d7ad55]"
                  />
                </div>

                {/* Message */}
                <div className="mt-5">
                  <label
                    htmlFor="message"
                    className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    Tell us about your design
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you have in mind..."
                    className="mt-2 w-full resize-none border border-slate-200 bg-[#faf9f6] px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#d7ad55]"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#06151b] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#10262e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending enquiry..." : "Send enquiry"}

                  {!submitting && <ArrowRight size={14} strokeWidth={1.8} />}
                </button>

                <p className="mt-4 text-center text-[9px] leading-5 text-slate-400">
                  Your information will only be used to respond to your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          LOCATION / APPOINTMENT PLACEHOLDER
      ======================================================= */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 lg:px-12">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
              Visit us
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
              Studio location
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
              Our exact studio address will be added once the designer provides
              the official location details.
            </p>
          </div>

          <div className="flex min-h-45 items-center justify-center border border-dashed border-slate-300 bg-[#f8f6f0]">
            <div className="text-center">
              <MapPin
                size={24}
                strokeWidth={1.4}
                className="mx-auto text-[#b58a32]"
              />

              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Location placeholder
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Map will be connected later
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FIREBASE DEVELOPMENT NOTE
      ======================================================= */}
      <section className="border-t border-[#d7ad55]/20 bg-[#06151b]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d7ad55]">
            Development note
          </p>

          <p className="mt-3 max-w-3xl text-xs leading-6 text-white/50">
            The enquiry form currently uses temporary local submission behavior.
            During the backend stage, enquiries will be stored in Firebase
            Firestore so the designer can view and manage them from the admin
            dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Contact;
