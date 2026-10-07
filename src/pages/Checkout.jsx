import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, Loader2, Lock } from "lucide-react";
import { SITE } from "../data/site";
import { deliveryFee, useCart } from "../lib/cart";
import { submitNetlifyForm } from "../lib/forms";
import { cn, normalizeBdPhone, tk } from "../lib/format";
import { readJSON, writeJSON } from "../lib/storage";
import ProductArt from "../components/ProductArt";

export const ORDERS_KEY = "gc-orders-v1";

const EMPTY = { name: "", phone: "", email: "", address: "", area: "inside", note: "" };

function validate(f) {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!normalizeBdPhone(f.phone)) errors.phone = "Enter a Bangladeshi mobile number, e.g. 01712-345678.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = "That email doesn't look right.";
  if (f.address.trim().length < 8) errors.address = "Please add house, road and area so the courier can find you.";
  return errors;
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label} {optional && <span className="font-normal text-zinc-500">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (err) =>
  cn(
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none",
    err ? "border-red-500 focus:border-red-600" : "border-zinc-300 focus:border-navy-500",
  );

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | error

  const fee = deliveryFee(form.area, subtotal);
  const total = subtotal + fee;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  if (lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-extrabold text-navy-900">Nothing to check out yet</h1>
        <p className="mt-2 text-zinc-600">Your cart is empty.</p>
        <Link to="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-navy-800 px-6 font-bold text-white hover:bg-navy-600">
          Browse products
        </Link>
      </div>
    );
  }

  async function placeOrder(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    const id = `GC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const order = {
      id,
      placedAt: new Date().toISOString(),
      customer: { ...form, phone: normalizeBdPhone(form.phone) },
      items: lines.map((l) => ({ slug: l.slug, name: l.product.name, color: l.color, qty: l.qty, price: l.product.price })),
      subtotal,
      delivery: fee,
      total,
    };

    setStatus("sending");
    try {
      await submitNetlifyForm("order", {
        "order-id": id,
        name: form.name.trim(),
        phone: order.customer.phone,
        email: form.email.trim(),
        address: form.address.trim(),
        area: SITE.delivery[form.area].label,
        note: form.note.trim(),
        items: order.items.map((i) => `${i.qty} × ${i.name}${i.color ? ` (${i.color})` : ""} — ${tk(i.qty * i.price)}`).join("\n"),
        subtotal: tk(subtotal),
        delivery: tk(fee),
        total: tk(total),
        payment: "Cash on delivery",
      });
    } catch {
      setStatus("error");
      return;
    }

    writeJSON(ORDERS_KEY, [order, ...readJSON(ORDERS_KEY, [])].slice(0, 10));
    navigate(`/order/${id}`, { replace: true });
    clear();
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">Checkout</h1>

      <form onSubmit={placeOrder} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200">
            <h2 className="text-lg font-bold text-navy-900">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}>
                <input id="name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={inputClass(errors.name)} />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone}>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} className={inputClass(errors.phone)} />
              </Field>
              <div className="sm:col-span-2">
                <Field id="email" label="Email" optional error={errors.email}>
                  <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={inputClass(errors.email)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="address" label="Full address" error={errors.address}>
                  <textarea id="address" rows={3} autoComplete="street-address" placeholder="House, road, area, city" value={form.address} onChange={set("address")} aria-invalid={!!errors.address} aria-describedby={errors.address ? "address-error" : undefined} className={inputClass(errors.address)} />
                </Field>
              </div>
            </div>

            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-semibold text-navy-900">Delivery area</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(SITE.delivery).map(([key, d]) => (
                  <label key={key} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition", form.area === key ? "bg-navy-50 ring-navy-500" : "ring-zinc-200 hover:ring-navy-300")}>
                    <input type="radio" name="area" value={key} checked={form.area === key} onChange={set("area")} className="mt-1 accent-navy-700" />
                    <span className="text-sm">
                      <span className="block font-semibold text-navy-900">{d.label}</span>
                      <span className="text-zinc-600">
                        {subtotal >= SITE.freeDeliveryOver ? "Free" : tk(d.fee)} · {d.eta}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <Field id="note" label="Note for the courier" optional>
                <input id="note" value={form.note} onChange={set("note")} placeholder="e.g. call before coming" className={inputClass(false)} />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200">
            <h2 className="text-lg font-bold text-navy-900">Payment</h2>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-navy-50 p-4 ring-1 ring-navy-500">
              <Banknote className="mt-0.5 size-5 text-navy-700" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold text-navy-900">Cash on delivery</p>
                <p className="text-zinc-600">Pay the courier in cash when your parcel arrives. We'll call to confirm the order first.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-zinc-200 lg:sticky lg:top-32">
          <h2 className="text-lg font-bold text-navy-900">Your order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <div className="relative">
                  <ProductArt product={l.product} className="size-14 rounded-xl" iconClass="size-[50%]" />
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-navy-800 text-[11px] font-bold text-white">{l.qty}</span>
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold text-navy-900">{l.product.name}</p>
                  {l.color && <p className="text-zinc-500">{l.color}</p>}
                </div>
                <p className="text-sm font-semibold">{tk(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-600">Subtotal</dt>
              <dd>{tk(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-600">Delivery ({SITE.delivery[form.area].label})</dt>
              <dd>{fee === 0 ? "Free" : tk(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-base">
              <dt className="font-bold text-navy-900">Total</dt>
              <dd className="font-display font-extrabold text-navy-900">{tk(total)}</dd>
            </div>
          </dl>

          {status === "error" && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              We couldn't send your order. Please try again, or call us on <a className="font-semibold underline" href={SITE.phoneHref}>{SITE.phone}</a>.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-flame-500 font-bold text-navy-950 transition hover:bg-flame-400 disabled:opacity-70"
          >
            {status === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
            {status === "sending" ? "Placing order…" : `Place order · ${tk(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-zinc-500">{SITE.moneyBackDays}-day money-back guarantee on every order.</p>
        </aside>
      </form>
    </div>
  );
}
