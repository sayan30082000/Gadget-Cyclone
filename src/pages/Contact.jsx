import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleCheck, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "../data/site";
import { submitNetlifyForm } from "../lib/forms";
import { cn } from "../lib/format";

const TOPICS = {
  order: "Question about an order",
  product: "Product question",
  partnership: "Partnership / wholesale",
  other: "Something else",
};

const inputClass = "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-navy-500 focus:outline-none";

export default function Contact() {
  const [params] = useSearchParams();
  const initialTopic = TOPICS[params.get("topic")] ? params.get("topic") : "order";
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: initialTopic, message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function send(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitNetlifyForm("contact", { ...form, topic: TOPICS[form.topic] });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const cards = [
    { icon: Phone, label: "Call us", value: SITE.phone, href: SITE.phoneHref },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: "Based in", value: SITE.city },
  ];

  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold tracking-wide text-flame-700 uppercase">Contact</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy-900 sm:text-5xl">Let's talk gadgets</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-700">Questions about an order, a product, or working together — send a message and we'll get back to you.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <ul className="space-y-3">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const body = (
              <>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-flame-100 text-flame-700">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-zinc-600">{label}</span>
                  <span className="block font-semibold break-all text-navy-900">{value}</span>
                </span>
              </>
            );
            return (
              <li key={label}>
                {href ? (
                  <a href={href} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-zinc-200 transition hover:ring-navy-300">
                    {body}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-zinc-200">{body}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200 sm:p-8">
          {status === "sent" ? (
            <div className="grid place-items-center py-10 text-center" role="status">
              <CircleCheck className="size-14 text-emerald-600" aria-hidden />
              <p className="mt-4 font-display text-2xl font-bold text-navy-900">Message sent</p>
              <p className="mt-2 text-zinc-600">Thanks, {form.name.split(" ")[0] || "there"}! We'll reply soon.</p>
            </div>
          ) : (
            <form onSubmit={send} className="grid gap-4 sm:grid-cols-2">
              <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-navy-900">Name</label>
                <input id="c-name" required autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Phone <span className="font-normal text-zinc-500">(optional)</span>
                </label>
                <input id="c-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold text-navy-900">Email</label>
                <input id="c-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-topic" className="mb-1.5 block text-sm font-semibold text-navy-900">Topic</label>
                <select id="c-topic" value={form.topic} onChange={set("topic")} className={inputClass}>
                  {Object.entries(TOPICS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold text-navy-900">Message</label>
                <textarea id="c-message" required rows={5} value={form.message} onChange={set("message")} className={inputClass} />
              </div>
              {status === "error" && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
                  Couldn't send that. Please try again or call {SITE.phone}.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className={cn("flex h-12 items-center justify-center gap-2 rounded-full bg-navy-800 px-6 font-bold text-white transition hover:bg-navy-600 disabled:opacity-70 sm:col-span-2 sm:justify-self-start")}
              >
                {status === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
