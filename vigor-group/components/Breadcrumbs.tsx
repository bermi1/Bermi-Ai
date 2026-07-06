import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  href?: string;
  label: string;
}

/** Accessible breadcrumb trail for inner pages. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-sand-100/70">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-white">
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 text-sand-100/40" strokeWidth={2} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
