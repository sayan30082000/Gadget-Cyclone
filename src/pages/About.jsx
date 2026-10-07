import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Sparkles, Truck } from "lucide-react";
import { SITE } from "../data/site";
import logo from "../assets/logo.webp";
import TrustStrip from "../components/TrustStrip";

const VALUES = [
  { icon: Sparkles, title: "Future-minded picks", text: "We hunt for gadgets that genuinely make everyday life easier, not just the newest box on the shelf." },
  { icon: BadgeCheck, title: "Honest listings", text: "Clear specs and real prices. What you see on the page is what arrives at your door." },
  { icon: Truck, title: "Delivered, then paid", text: "Cash on delivery across Bangladesh, so you only pay once it's in your hands." },
];

export default function About() {
  return (
    <div className="container-page py-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-wide text-flame-700 uppercase">About us</p>
          <h1 className="mt-2 text-4xl font-extrabold text-balance text-navy-900 sm:text-5xl">Gadgets that spin everyday life forward</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">
            {SITE.name} started in {SITE.city.split(",")[0]} with a simple idea: the tech that makes life easier shouldn't be hard to
            find, hard to trust or hard to afford. From smart-home devices to the latest accessories, we pick products built with the
            future in mind and get them to your door fast.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-zinc-700">
            We're always looking for makers and brands to work with. If you're building something people will love, we'd like to
            help bring it to the market.
          </p>
          <Link to="/contact?topic=partnership" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-navy-800 px-6 font-bold text-white hover:bg-navy-600">
            Work with us <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <img src={logo} alt={`${SITE.name} logo`} width="320" height="320" className="mx-auto w-full max-w-sm rounded-[2.5rem] bg-logo-bg shadow-xl ring-1 ring-navy-900/10" />
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">What we stand for</h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200">
              <span className="grid size-12 place-items-center rounded-2xl bg-navy-800 text-flame-300">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy-900">{title}</h3>
              <p className="mt-2 text-zinc-600">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <TrustStrip />
      </section>
    </div>
  );
}
