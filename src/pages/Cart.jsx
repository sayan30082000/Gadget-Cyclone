import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2, Truck } from "lucide-react";
import { SITE } from "../data/site";
import { useCart } from "../lib/cart";
import { tk } from "../lib/format";
import ProductArt from "../components/ProductArt";
import QuantityStepper from "../components/QuantityStepper";

export function FreeDeliveryMeter({ subtotal }) {
  const left = SITE.freeDeliveryOver - subtotal;
  const pct = Math.min(100, (subtotal / SITE.freeDeliveryOver) * 100);
  return (
    <div className="rounded-2xl bg-flame-50 p-4 ring-1 ring-flame-200">
      <p className="flex items-center gap-2 text-sm text-navy-900">
        <Truck className="size-4 shrink-0 text-flame-700" aria-hidden />
        {left > 0 ? (
          <span>
            Add <strong>{tk(left)}</strong> more for free delivery.
          </span>
        ) : (
          <strong>You've unlocked free delivery!</strong>
        )}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-flame-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free delivery">
        <div className="h-full rounded-full bg-flame-500 transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Cart() {
  const { lines, subtotal, count, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-page grid place-items-center py-24 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-navy-100 text-navy-700">
          <ShoppingBag className="size-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-navy-900">Your cart is empty</h1>
        <p className="mt-2 text-zinc-600">Find something you'll love — new gadgets land every week.</p>
        <Link to="/shop" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-navy-800 px-6 font-bold text-white hover:bg-navy-600">
          Start shopping <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
        Your cart <span className="text-zinc-500">({count})</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-zinc-200 rounded-3xl bg-white ring-1 ring-zinc-200">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${l.slug}`} className="shrink-0">
                <ProductArt product={l.product} className="size-20 rounded-2xl sm:size-24" iconClass="size-[45%]" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${l.slug}`} className="font-semibold text-navy-900 hover:text-navy-600">
                    {l.product.name}
                  </Link>
                  {l.color && <p className="text-sm text-zinc-600">Colour: {l.color}</p>}
                  <p className="text-sm text-zinc-600">{tk(l.product.price)} each</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <QuantityStepper small value={l.qty} max={l.product.stock} onChange={(q) => setQty(l.key, q)} label={`Quantity of ${l.product.name}`} />
                  <p className="w-24 text-right font-display font-bold text-navy-900">{tk(l.lineTotal)}</p>
                  <button
                    type="button"
                    onClick={() => remove(l.key)}
                    className="grid size-9 place-items-center rounded-full text-zinc-500 transition hover:bg-red-50 hover:text-red-700"
                    aria-label={`Remove ${l.product.name} from cart`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-4 lg:sticky lg:top-32">
          <FreeDeliveryMeter subtotal={subtotal} />
          <div className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200">
            <h2 className="text-lg font-bold text-navy-900">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-600">Subtotal</dt>
                <dd className="font-semibold">{tk(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Delivery</dt>
                <dd className="text-zinc-600">{subtotal >= SITE.freeDeliveryOver ? "Free" : "Calculated at checkout"}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-flame-500 font-bold text-navy-950 transition hover:bg-flame-400">
              Checkout <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link to="/shop" className="mt-3 block text-center text-sm font-semibold text-navy-700 hover:text-navy-500">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
