import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Droplets, HeartPulse, Navigation, ShieldCheck, Timer } from "lucide-react";
import { CATEGORIES, DEAL, PRODUCTS, discountPercent } from "../data/products";
import { SITE } from "../data/site";
import { useCart } from "../lib/cart";
import { tk } from "../lib/format";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import TrustStrip from "../components/TrustStrip";

const DEAL_FEATURES = [
  { icon: Timer, label: "Stopwatch & lap timer" },
  { icon: Activity, label: "Advanced fitness tracking" },
  { icon: Droplets, label: "Water-resistant" },
  { icon: Navigation, label: "Built-in GPS" },
  { icon: HeartPulse, label: "Health monitoring" },
];

function Hero() {
  const { add } = useCart();
  const navigate = useNavigate();
  const off = discountPercent(DEAL);

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="absolute -top-40 -right-40 size-[36rem] rounded-full bg-flame-500/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-48 -left-32 size-[30rem] rounded-full bg-navy-500/30 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-flame-300 uppercase ring-1 ring-white/15">
            Deal of the week · {off}% off
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl lg:text-6xl">
            Precision timing at your <span className="text-flame-400">fingertips</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-100">
            Track every second with the {DEAL.name}. Whether you're timing workouts, experiments or events, get accuracy and ease
            in a compact, water-resistant design.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {DEAL_FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/10">
                <Icon className="size-4 text-flame-300" aria-hidden /> {label}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="font-display text-4xl font-extrabold">
              <span className="sr-only">Today </span>
              {tk(DEAL.price)}
            </p>
            <p className="pb-1 text-lg text-navy-200">
              Total value <span className="line-through">{tk(DEAL.compareAt)}</span>
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                add(DEAL.slug, 1, DEAL.colors?.[0]?.name ?? null);
                navigate("/cart");
              }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-flame-500 px-6 font-bold text-navy-950 shadow-lg shadow-flame-500/30 transition hover:bg-flame-400"
            >
              Get yours now <ArrowRight className="size-4" aria-hidden />
            </button>
            <Link
              to={`/product/${DEAL.slug}`}
              className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              See details
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-navy-200">
            <ShieldCheck className="size-4 text-flame-300" aria-hidden />
            100% risk-free — {SITE.moneyBackDays}-day money-back guarantee
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <ProductArt product={DEAL} className="aspect-square rounded-[2.5rem] shadow-2xl shadow-black/40 ring-1 ring-white/10" iconClass="size-[46%]" />
          <div className="absolute -bottom-5 left-4 rounded-2xl bg-white px-4 py-3 text-navy-900 shadow-xl sm:left-8">
            <p className="text-xs font-semibold text-zinc-500 uppercase">You save</p>
            <p className="font-display text-2xl font-extrabold text-flame-700">{tk(DEAL.compareAt - DEAL.price)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container-page mt-16">
      <SectionHeading kicker="Browse" title="Shop by category" link="/shop" linkLabel="All products" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => {
          const n = PRODUCTS.filter((p) => p.category === c.id).length;
          const Icon = c.icon;
          return (
            <li key={c.id}>
              <Link
                to={`/shop?category=${c.id}`}
                className="group flex h-full flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-900/10"
              >
                <span className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br text-white ${c.tint}`}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-navy-900 group-hover:text-navy-600">{c.name}</span>
                  <span className="text-sm text-zinc-500">
                    {n} {n === 1 ? "product" : "products"}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Innovate() {
  return (
    <section className="container-page mt-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flame-400 to-flame-600 px-6 py-12 sm:px-12">
        <div aria-hidden className="absolute -top-20 -right-10 size-72 rounded-full bg-white/20" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-extrabold text-navy-950 sm:text-4xl">Want to innovate with us?</h2>
          <p className="mt-4 text-lg text-navy-950/85">
            From smart-home devices to the latest tech accessories, we look for products built with the future in mind. Makers,
            brands and resellers: let's bring the next big gadget to the Bangladeshi market together.
          </p>
          <Link
            to="/contact?topic=partnership"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-navy-900 px-6 font-bold text-white transition hover:bg-navy-700"
          >
            Contact us <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const trending = PRODUCTS.filter((p) => p.featured && !p.deal);
  const deals = PRODUCTS.filter((p) => discountPercent(p) > 0 && !p.deal)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 4);

  return (
    <>
      <Hero />
      <section className="container-page mt-12">
        <TrustStrip />
      </section>
      <Categories />
      <section className="container-page mt-20">
        <SectionHeading kicker="Popular right now" title="Trending gadgets" link="/shop" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
      <Innovate />
      <section className="container-page mt-20">
        <SectionHeading kicker="Limited stock" title="Biggest savings" link="/shop?sort=discount" linkLabel="All deals" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
