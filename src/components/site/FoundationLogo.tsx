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
    className:
      "w-[220px] sm:w-[300px] lg:w-[360px] xl:w-[400px] max-w-full h-auto drop-shadow-md",
    sizes: "(max-width: 640px) 220px, (max-width: 1024px) 300px, 400px",
  },
  auth: {
    width: 128,
    height: 128,
    className: "h-28 w-28 sm:h-32 sm:w-32",
    sizes: "128px",
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
}: {
  alt: string;
  size?: keyof typeof sizes;
  priority?: boolean;
  /** @deprecated white frames removed — transparent logo sits cleanly */
  framed?: boolean;
}) {
  const config = sizes[size];

  return (
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
}
