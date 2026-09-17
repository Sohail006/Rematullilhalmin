import type { ReactNode } from "react";

export function PageHero({
  title,
  intro,
  eyebrow,
  children,
  wide,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  children?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="bg-[#f7f8f6]">
      <div className="border-b border-brand-green/10 bg-brand-green text-white">
        <div className="container-site py-10 sm:py-12">
          {eyebrow ? (
            <p className="text-brand-yellow text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase mb-3">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight max-w-3xl">
            {title}
          </h1>
          <span className="mt-4 block h-1 w-20 rounded-full bg-brand-yellow" />
          {intro ? (
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl">
              {intro}
            </p>
          ) : null}
        </div>
      </div>
      {children ? (
        <div className="container-site py-10 sm:py-12">
          <div className={wide ? "max-w-5xl" : "max-w-4xl"}>{children}</div>
        </div>
      ) : null}
    </div>
  );
}
