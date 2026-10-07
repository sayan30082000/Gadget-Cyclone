import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { discountPercent, getCategory } from "../data/products";
import { useCart } from "../lib/cart";
import ProductArt from "./ProductArt";
import Price from "./Price";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const off = discountPercent(product);
  const soldOut = product.stock < 1;
  const url = `/product/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy-900/10">
      <div className="overflow-hidden">
        <ProductArt product={product} className="aspect-[4/3] transition duration-300 group-hover:scale-[1.04]" />
      </div>
      <div className="absolute top-3 left-3 flex gap-1.5">
        {off > 0 && <span className="rounded-full bg-flame-500 px-2.5 py-1 text-xs font-bold text-navy-950">-{off}%</span>}
        {soldOut && <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">Sold out</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">{getCategory(product.category)?.name}</p>
        <h3 className="font-display text-base leading-snug font-semibold">
          {/* The ::after overlay makes the whole card clickable. */}
          <Link to={url} className="after:absolute after:inset-0 hover:text-navy-600">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-600">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <Price product={product} />
          <button
            type="button"
            onClick={() => add(product.slug, 1, product.colors?.[0]?.name ?? null)}
            disabled={soldOut}
            className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-navy-800 text-white transition hover:bg-navy-600 disabled:cursor-not-allowed disabled:bg-zinc-300"
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            <ShoppingCart className="size-4.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
