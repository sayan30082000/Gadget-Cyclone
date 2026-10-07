import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, discountPercent, getCategory } from "../data/products";
import { cn } from "../lib/format";
import ProductCard from "../components/ProductCard";

const SORTS = {
  featured: { label: "Featured", fn: (a, b) => (b.featured ? 1 : 0) + (b.deal ? 2 : 0) - ((a.featured ? 1 : 0) + (a.deal ? 2 : 0)) },
  "price-asc": { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  discount: { label: "Biggest discount", fn: (a, b) => discountPercent(b) - discountPercent(a) },
};

const PRICE_CAPS = [
  { value: "", label: "Any price" },
  { value: "1000", label: "Under Tk 1,000" },
  { value: "2000", label: "Under Tk 2,000" },
  { value: "3000", label: "Under Tk 3,000" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "";
  const q = params.get("q") ?? "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "featured";
  const max = params.get("max") ?? "";
  const inStock = params.get("stock") === "1";

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (category && p.category !== category) return false;
      if (max && p.price >= Number(max)) return false;
      if (inStock && p.stock < 1) return false;
      if (!needle) return true;
      const hay = [p.name, p.tagline, getCategory(p.category)?.name, ...p.highlights].join(" ").toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    }).sort(SORTS[sort].fn);
  }, [category, q, max, inStock, sort]);

  const activeCat = getCategory(category);
  const hasFilters = category || q || max || inStock;

  const pill = (active) =>
    cn(
      "shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
      active ? "bg-navy-800 text-white ring-navy-800" : "bg-white text-navy-800 ring-zinc-200 hover:ring-navy-300",
    );

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">{activeCat ? activeCat.name : "All products"}</h1>
        <p className="mt-2 text-zinc-600">{activeCat ? activeCat.blurb : "Every gadget we stock, ready to ship from Chattogram."}</p>
      </header>

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Categories">
        <button type="button" className={pill(!category)} aria-pressed={!category} onClick={() => update("category", "")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" className={pill(category === c.id)} aria-pressed={category === c.id} onClick={() => update("category", c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium text-zinc-600">Price</span>
          <select value={max} onChange={(e) => update("max", e.target.value)} className="h-10 rounded-full border border-zinc-300 bg-white px-3 text-sm">
            {PRICE_CAPS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input type="checkbox" checked={inStock} onChange={(e) => update("stock", e.target.checked ? "1" : "")} className="size-4 accent-navy-700" />
          In stock only
        </label>
        <label className="flex items-center gap-2 text-sm sm:ml-auto">
          <span className="font-medium text-zinc-600">Sort</span>
          <select value={sort} onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)} className="h-10 rounded-full border border-zinc-300 bg-white px-3 text-sm">
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
          {q && (
            <>
              {" "}for “<strong className="text-navy-900">{q}</strong>”
            </>
          )}
        </p>
        {q && (
          <button type="button" onClick={() => update("q", "")} className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-300">
            Clear search <X className="size-3" aria-hidden />
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-zinc-200">
          <SearchX className="size-10 text-zinc-400" aria-hidden />
          <p className="mt-4 font-display text-xl font-bold text-navy-900">Nothing matches that</p>
          <p className="mt-1 text-zinc-600">Try a different word or loosen the filters.</p>
          {hasFilters && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-5 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-600">
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
