import { Banknote, PhoneCall, RotateCcw, Truck } from "lucide-react";
import { SITE } from "../data/site";
import { tk } from "../lib/format";

const ITEMS = [
  { icon: Truck, title: "Fast delivery", text: `${SITE.delivery.inside.eta} in Chattogram, free over ${tk(SITE.freeDeliveryOver)}` },
  { icon: Banknote, title: "Cash on delivery", text: "Pay when the parcel reaches you" },
  { icon: RotateCcw, title: `${SITE.moneyBackDays}-day money back`, text: "100% risk-free on every order" },
  { icon: PhoneCall, title: "Real people, real help", text: SITE.phone },
];

export default function TrustStrip() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-flame-100 text-flame-700">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-navy-900">{title}</p>
            <p className="text-sm text-zinc-600">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
