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
      <div className="container-site relative py-12 sm:py-14 max-w-4xl">
        <h1 className="section-title text-3xl sm:text-4xl animate-fade-up">
          {title}
        </h1>
        <div className="gold-divider justify-start mt-4 mb-5">
          <span className="text-brand-gold text-xs">◆</span>
        </div>
        {intro ? (
          <p className="text-brand-muted text-lg leading-relaxed max-w-2xl animate-fade-up">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-8 animate-fade-up">{children}</div> : null}
      </div>
    </div>
  );
}
