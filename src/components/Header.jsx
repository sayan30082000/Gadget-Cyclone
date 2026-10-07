import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { SITE } from "../data/site";
import { useCart } from "../lib/cart";
import { cn, tk } from "../lib/format";
import Logo from "./Logo";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Products" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
];

function SearchBox({ className = "", onDone }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const urlQ = params.get("q") ?? "";
  const [q, setQ] = useState(urlQ);

  // Follow the URL when the search is cleared or changed elsewhere (e.g. on /shop).
  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
        onDone?.();
      }}
    >
      <label htmlFor={onDone ? "search-mobile" : "search"} className="sr-only">
        Search gadgets
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" aria-hidden />
      <input
        id={onDone ? "search-mobile" : "search"}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search watches, earbuds, chargers…"
        className="h-11 w-full rounded-full border border-zinc-300 bg-white pr-4 pl-10 text-sm placeholder:text-zinc-500 focus:border-navy-500 focus:outline-none"
      />
    </form>
  );
}

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    cn("rounded-full px-3.5 py-2 text-sm font-semibold transition", isActive ? "bg-navy-800 text-white" : "text-navy-800 hover:bg-navy-50");

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-paper/90 backdrop-blur">
      <p className="bg-navy-900 px-4 py-2 text-center text-xs font-medium text-navy-100 sm:text-sm">
        Free delivery on orders over <strong className="text-flame-300">{tk(SITE.freeDeliveryOver)}</strong> · Cash on delivery across Bangladesh
      </p>
      <div className="container-page flex h-18 items-center gap-4">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <SearchBox className="ml-auto hidden w-72 md:block xl:w-96" />
        <Link
          to="/cart"
          className="relative ml-auto grid size-11 place-items-center rounded-full bg-white text-navy-800 ring-1 ring-zinc-200 transition hover:ring-navy-300 md:ml-0"
          aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-flame-500 px-1 text-[11px] font-bold text-navy-950">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-navy-800 hover:bg-navy-50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-paper lg:hidden">
          <div className="container-page flex flex-col gap-3 py-4">
            <SearchBox className="md:hidden" onDone={() => setOpen(false)} />
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
