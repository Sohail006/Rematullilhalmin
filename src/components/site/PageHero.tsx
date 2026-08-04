import type { ReactNode } from "react";

export function PageHero({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-shell">
      <div className="container-site relative py-10 sm:py-14">
        <div className="max-w-3xl">
          <h1 className="section-title text-3xl sm:text-4xl">
            {title}
          </h1>
          <div className="gold-divider justify-start mt-4 mb-5">
            <span className="text-brand-gold text-xs" aria-hidden>
              ◆
            </span>
          </div>
          {intro ? (
            <p className="text-brand-muted text-lg leading-relaxed">
              {intro}
            </p>
          ) : null}
        </div>
        {children ? (
          <div className="mt-8 max-w-4xl">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
