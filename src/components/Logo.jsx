import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import { SITE } from "../data/site";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label={`${SITE.name} home`}>
      <img src={logo} alt="" width="44" height="44" className="size-11 rounded-xl bg-logo-bg object-cover ring-1 ring-navy-900/10" />
      <span className="font-display text-lg leading-none font-extrabold tracking-tight text-navy-800 uppercase">
        Gadget
        <br />
        <span className="text-flame-600">Cyclone</span>
      </span>
    </Link>
  );
}
