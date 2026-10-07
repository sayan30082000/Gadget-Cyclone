import { Link, useParams } from "react-router-dom";
import { CircleCheck, PhoneCall } from "lucide-react";
import { SITE } from "../data/site";
import { tk } from "../lib/format";
import { readJSON } from "../lib/storage";
import { ORDERS_KEY } from "./Checkout";

export default function OrderPlaced() {
  const { id } = useParams();
  const order = readJSON(ORDERS_KEY, []).find((o) => o.id === id);

  return (
    <div className="container-page max-w-2xl py-16">
      <div className="text-center">
        <CircleCheck className="mx-auto size-16 text-emerald-600" aria-hidden />
        <h1 className="mt-4 text-3xl font-extrabold text-navy-900 sm:text-4xl">Thank you! Your order is in.</h1>
        <p className="mt-3 text-zinc-700">
          Order number <strong className="font-mono text-navy-900">{id}</strong>
        </p>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-flame-50 p-4 text-sm ring-1 ring-flame-200">
        <PhoneCall className="mt-0.5 size-5 shrink-0 text-flame-700" aria-hidden />
        <p className="text-navy-900">
          We'll call {order ? <strong>{order.customer.phone}</strong> : "you"} shortly to confirm. Questions? Call{" "}
          <a href={SITE.phoneHref} className="font-semibold underline">{SITE.phone}</a>.
        </p>
      </div>

      {order && (
        <section className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-zinc-200">
          <h2 className="text-lg font-bold text-navy-900">Order summary</h2>
          <ul className="mt-4 divide-y divide-zinc-200 text-sm">
            {order.items.map((i) => (
              <li key={`${i.slug}-${i.color}`} className="flex justify-between gap-4 py-2.5">
                <span>
                  {i.qty} × {i.name}
                  {i.color && <span className="text-zinc-500"> ({i.color})</span>}
                </span>
                <span className="font-semibold">{tk(i.qty * i.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1.5 border-t border-zinc-200 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-600">Subtotal</dt><dd>{tk(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-600">Delivery</dt><dd>{order.delivery === 0 ? "Free" : tk(order.delivery)}</dd></div>
            <div className="flex justify-between text-base"><dt className="font-bold">Total (cash on delivery)</dt><dd className="font-display font-extrabold">{tk(order.total)}</dd></div>
          </dl>
          <p className="mt-4 text-sm text-zinc-600">
            Delivering to {order.customer.name}, {order.customer.address}
          </p>
        </section>
      )}

      <div className="mt-8 text-center">
        <Link to="/shop" className="inline-flex h-12 items-center rounded-full bg-navy-800 px-6 font-bold text-white hover:bg-navy-600">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
