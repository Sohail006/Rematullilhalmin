import { SOCIAL_LINKS } from "@/lib/site";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zM17.25 7.4a.85.85 0 1 1-.85.85.85.85 0 0 1 .85-.85z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M14.5 3c.4 2.1 1.7 3.7 3.8 4.1v2.3c-1.3-.1-2.5-.5-3.5-1.2v6.2a5.3 5.3 0 1 1-4.6-5.2v2.5a2.8 2.8 0 1 0 2 2.7V3h2.3z" />
    </svg>
  );
}

const icons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

type SocialLinksProps = {
  /** topbar = sticky dark strip; header = main nav; footer/light = page sections */
  variant?: "topbar" | "header" | "footer" | "light";
  className?: string;
  showLabels?: boolean;
};

export function SocialLinks({
  variant = "footer",
  className = "",
  showLabels = false,
}: SocialLinksProps) {
  const styles = {
    topbar:
      "inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-yellow text-brand-ink shadow-sm transition hover:brightness-105 hover:scale-105",
    header:
      "inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-green/20 bg-brand-green-soft text-brand-green transition hover:bg-brand-green hover:text-white hover:border-brand-green",
    footer: showLabels
      ? "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
      : "inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-ink transition hover:brightness-105",
    light: showLabels
      ? "inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white px-3.5 py-2.5 text-sm font-medium text-brand-green transition hover:bg-brand-green-soft"
      : "inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-green text-white shadow-sm transition hover:bg-brand-green-mid",
  } as const;

  const iconSize = {
    topbar: "h-4 w-4",
    header: "h-4 w-4",
    footer: "h-4 w-4",
    light: "h-5 w-5",
  } as const;

  return (
    <nav
      aria-label="Social media"
      className={`flex flex-wrap items-center gap-2 ${className}`}
    >
      {SOCIAL_LINKS.map((item) => {
        const Icon = icons[item.key];
        return (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            className={styles[variant]}
          >
            <Icon className={`${iconSize[variant]} shrink-0`} />
            {showLabels ? <span>{item.label}</span> : null}
            {!showLabels ? <span className="sr-only">{item.label}</span> : null}
          </a>
        );
      })}
    </nav>
  );
}
