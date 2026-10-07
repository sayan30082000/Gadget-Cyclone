import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Banknote, Check, ChevronRight, RotateCcw, ShoppingCart, Truck } from "lucide-react";
import { PRODUCTS, getCategory, getProduct } from "../data/products";
import { SITE } from "../data/site";
import { useCart } from "../lib/cart";
import { cn, tk } from "../lib/format";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import Price from "../components/Price";
import QuantityStepper from "../components/QuantityStepper";
import SectionHeading from "../components/SectionHeading";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  // Keyed by slug so quantity and colour reset when moving between products.
  return product ? <ProductDetail key={slug} product={product} /> : <NotFound />;
}

function ProductDetail({ product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0] ?? null);
  const category = getCategory(product.category);
  const soldOut = product.stock < 1;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const addToCart = () => add(product.slug, qty, color?.name ?? null);

  return (
    <div className="container-page py-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-zinc-600">
        <Link to="/" className="hover:text-navy-700">Home</Link>
        <ChevronRight className="size-4" aria-hidden />
        <Link to={`/shop?category=${category.id}`} className="hover:text-navy-700">{category.name}</Link>
        <ChevronRight className="size-4" aria-hidden />
        <span aria-current="page" className="font-medium text-navy-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductArt product={product} className="aspect-square rounded-3xl lg:sticky lg:top-32" iconClass="size-[42%]" swatch={color?.hex} />

        <div>
          <p className="text-sm font-semibold tracking-wide text-flame-700 uppercase">{category.name}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-navy-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg text-zinc-700">{product.tagline}</p>

          <div className="mt-6">
            <Price product={product} size="lg" showSave />
          </div>
          <p className={cn("mt-2 text-sm font-medium", soldOut ? "text-red-700" : product.stock <= 10 ? "text-flame-700" : "text-emerald-700")}>
            {soldOut ? "Sold out — check back soon" : product.stock <= 10 ? `Only ${product.stock} left in stock` : "In stock, ready to ship"}
          </p>

          {product.colors && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-semibold text-navy-900">
                Colour: <span className="font-normal text-zinc-600">{color?.name}</span>
              </legend>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <label key={c.name} className="cursor-pointer">
                    <input type="radio" name="color" value={c.name} checked={color?.name === c.name} onChange={() => setColor(c)} className="peer sr-only" />
                    <span
                      className="block size-10 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-paper transition peer-checked:ring-flame-500 peer-focus-visible:ring-navy-500"
                      style={{ backgroundColor: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)" }}
                    />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} max={Math.max(1, product.stock)} onChange={setQty} />
            <button
              type="button"
              onClick={addToCart}
              disabled={soldOut}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-navy-800 px-6 font-bold text-white transition hover:bg-navy-600 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:flex-none"
            >
              <ShoppingCart className="size-5" aria-hidden /> Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart();
                navigate("/checkout");
              }}
              disabled={soldOut}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-flame-500 px-6 font-bold text-navy-950 transition hover:bg-flame-400 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 sm:flex-none"
            >
              Buy now
            </button>
          </div>

          <ul className="mt-8 grid gap-3 rounded-2xl bg-white p-5 text-sm ring-1 ring-zinc-200 sm:grid-cols-3">
            <li className="flex items-start gap-2">
              <Truck className="mt-0.5 size-4 shrink-0 text-flame-600" aria-hidden />
              <span>
                {tk(SITE.delivery.inside.fee)} in Chattogram, {tk(SITE.delivery.outside.fee)} elsewhere. Free over {tk(SITE.freeDeliveryOver)}.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Banknote className="mt-0.5 size-4 shrink-0 text-flame-600" aria-hidden />
              <span>Cash on delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <RotateCcw className="mt-0.5 size-4 shrink-0 text-flame-600" aria-hidden />
              <span>{SITE.moneyBackDays}-day money-back guarantee</span>
            </li>
          </ul>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy-900">Overview</h2>
            <p className="mt-3 leading-relaxed text-zinc-700">{product.description}</p>
            <ul className="mt-5 space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-zinc-800">
                  <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden /> {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy-900">Specifications</h2>
            <dl className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
              {product.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(7rem,1fr)_2fr] gap-4 px-4 py-3 text-sm">
                  <dt className="font-medium text-zinc-600">{k}</dt>
                  <dd className="text-navy-900">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title={`More in ${category.name}`} link={`/shop?category=${category.id}`} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
