import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, X } from "lucide-react";
import { useCart } from "../lib/cart";

export default function Toast() {
  const { toast, dismissToast, count } = useCart();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 3200);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6">
      {toast && (
        <div key={toast.id} className="animate-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-navy-900 p-3 pl-4 text-white shadow-2xl">
          <CircleCheck className="size-5 shrink-0 text-flame-400" aria-hidden />
          <p className="min-w-0 flex-1 text-sm">
            <span className="font-semibold">{toast.name}</span>
            {toast.color ? ` (${toast.color})` : ""} added. <span className="text-navy-200">{count} in cart.</span>
          </p>
          <Link to="/cart" onClick={dismissToast} className="rounded-full bg-flame-500 px-3 py-1.5 text-xs font-bold text-navy-950 hover:bg-flame-400">
            View cart
          </Link>
          <button type="button" onClick={dismissToast} aria-label="Dismiss" className="grid size-8 place-items-center rounded-full text-navy-200 hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
