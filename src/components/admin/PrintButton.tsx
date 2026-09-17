"use client";

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-outline text-sm py-2"
    >
      {label}
    </button>
  );
}
