import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-flame-500">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy-900">This page blew away</h1>
      <p className="mt-2 text-zinc-600">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="inline-flex h-12 items-center rounded-full bg-navy-800 px-6 font-bold text-white hover:bg-navy-600">Go home</Link>
        <Link to="/shop" className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-navy-800 ring-1 ring-zinc-300 hover:bg-white">Browse products</Link>
      </div>
    </div>
  );
}
