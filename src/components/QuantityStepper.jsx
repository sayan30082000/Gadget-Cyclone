import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, max, onChange, label = "Quantity", small = false }) {
  const btn = `grid place-items-center text-navy-800 transition hover:bg-navy-50 disabled:cursor-not-allowed disabled:text-zinc-300 ${small ? "size-8" : "size-10"}`;
  return (
    <div className="inline-flex items-center rounded-full border border-zinc-300 bg-white" role="group" aria-label={label}>
      <button type="button" className={`${btn} rounded-l-full`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className={`min-w-8 text-center font-semibold tabular-nums ${small ? "text-sm" : ""}`} aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${btn} rounded-r-full`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
