import { discountPercent } from "../data/products";
import { cn, tk } from "../lib/format";

export default function Price({ product, size = "md", showSave = false }) {
  const off = discountPercent(product);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cn("font-display font-bold text-navy-900", size === "lg" ? "text-3xl" : "text-lg")}>{tk(product.price)}</span>
      {off > 0 && (
        <>
          <span className={cn("text-zinc-500 line-through", size === "lg" ? "text-lg" : "text-sm")}>
            <span className="sr-only">was </span>
            {tk(product.compareAt)}
          </span>
          {showSave && (
            <span className="rounded-full bg-flame-100 px-2 py-0.5 text-xs font-semibold text-flame-800">
              Save {tk(product.compareAt - product.price)} ({off}%)
            </span>
          )}
        </>
      )}
    </div>
  );
}
