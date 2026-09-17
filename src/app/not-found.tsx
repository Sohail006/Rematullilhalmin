import Link from "next/link";
import { FoundationLogo } from "@/components/site/FoundationLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f8f6] flex flex-col items-center justify-center px-4 text-center">
      <FoundationLogo alt="Al Sirat Ul Mustaqeem Foundation" size="auth" />
      <h1 className="mt-8 font-display text-3xl font-semibold text-brand-green">
        Page not found
      </h1>
      <p className="mt-3 text-brand-muted max-w-md leading-relaxed">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/en" className="btn-primary">
          Go to home
        </Link>
        <Link href="/en/donate" className="btn-donate">
          Donate Now
        </Link>
        <Link href="/en/apply" className="btn-outline">
          Apply for aid
        </Link>
      </div>
    </div>
  );
}
