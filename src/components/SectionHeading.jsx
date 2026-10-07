import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ kicker, title, link, linkLabel = "View all" }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="mb-1 text-sm font-semibold tracking-wide text-flame-700 uppercase">{kicker}</p>}
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-700 hover:text-navy-500">
          {linkLabel} <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
