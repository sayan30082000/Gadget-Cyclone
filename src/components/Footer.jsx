import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "../data/products";
import { SITE } from "../data/site";
import logo from "../assets/logo.webp";

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy-950 text-navy-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width="48" height="48" className="size-12 rounded-xl bg-logo-bg" />
            <p className="font-display text-xl font-extrabold text-white uppercase">{SITE.name}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Cutting-edge gadgets that make everyday life easier — picked, tested and shipped from {SITE.city.split(",")[0]}.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold tracking-wide text-white uppercase">Shop</h2>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/shop?category=${c.id}`} className="hover:text-flame-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold tracking-wide text-white uppercase">Company</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-flame-300">Products</Link></li>
            <li><Link to="/cart" className="hover:text-flame-300">Cart</Link></li>
            <li><Link to="/about" className="hover:text-flame-300">About us</Link></li>
            <li><Link to="/contact" className="hover:text-flame-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold tracking-wide text-white uppercase">Get in touch</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-flame-300">
                <Phone className="size-4 text-flame-400" aria-hidden /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 break-all hover:text-flame-300">
                <Mail className="size-4 shrink-0 text-flame-400" aria-hidden /> {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-flame-400" aria-hidden /> {SITE.city}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-navy-300">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
