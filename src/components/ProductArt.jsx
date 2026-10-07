import { getCategory } from "../data/products";
import { cn } from "../lib/format";

// Product artwork drawn in code: the category gradient plus the product's icon.
export default function ProductArt({ product, className = "", iconClass = "size-[38%]", swatch }) {
  const Icon = product.icon;
  const tint = product.tint ?? getCategory(product.category)?.tint;
  return (
    <div role="img" aria-label={product.name} className={cn("relative grid place-items-center overflow-hidden bg-gradient-to-br", tint, className)}>
      <div className="absolute -top-1/4 -right-1/4 size-3/4 rounded-full bg-white/10" />
      <div className="absolute -bottom-1/3 -left-1/4 size-3/4 rounded-full bg-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.28),transparent_50%)]" />
      <Icon aria-hidden className={cn("relative text-white drop-shadow-[0_10px_18px_rgba(0,0,0,.28)]", iconClass)} strokeWidth={1.25} />
      {swatch && (
        <span aria-hidden className="absolute right-3 bottom-3 size-5 rounded-full shadow ring-2 ring-white/90" style={{ backgroundColor: swatch }} />
      )}
    </div>
  );
}
