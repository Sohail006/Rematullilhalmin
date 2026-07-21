import Image from "next/image";

const sizes = {
  header: {
    width: 72,
    height: 72,
    className: "h-14 w-14 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]",
    sizes: "72px",
  },
  hero: {
    width: 400,
    height: 400,
    className: "w-[220px] sm:w-[300px] lg:w-[360px] xl:w-[400px] max-w-full h-auto",
    sizes: "(max-width: 640px) 220px, (max-width: 1024px) 300px, 400px",
  },
  auth: {
    width: 112,
    height: 112,
    className: "h-24 w-24 sm:h-28 sm:w-28",
    sizes: "112px",
  },
  footer: {
    width: 48,
    height: 48,
    className: "h-11 w-11 sm:h-12 sm:w-12",
    sizes: "48px",
  },
  sidebar: {
    width: 44,
    height: 44,
    className: "h-10 w-10",
    sizes: "44px",
  },
} as const;

export function FoundationLogo({
  alt,
  size = "header",
  priority = false,
  framed = false,
}: {
  alt: string;
  size?: keyof typeof sizes;
  priority?: boolean;
  framed?: boolean;
}) {
  const config = sizes[size];

  const image = (
    <Image
      src="/logo.png"
      alt={alt}
      width={config.width}
      height={config.height}
      sizes={config.sizes}
      quality={95}
      className={`object-contain ${config.className}`}
      priority={priority}
    />
  );

  if (!framed) return image;

  const frameClass =
    size === "hero"
      ? "rounded-full bg-white p-3 sm:p-4 lg:p-5 shadow-lg ring-1 ring-brand-green/10"
      : "rounded-full bg-white p-2.5 shadow-md ring-1 ring-brand-green/10";

  return <div className={frameClass}>{image}</div>;
}
