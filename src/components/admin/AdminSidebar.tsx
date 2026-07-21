"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";
import { hasPermission } from "@/lib/auth-client";
import { FoundationLogo } from "@/components/site/FoundationLogo";

const items = [
  {
    href: "/admin",
    label: "Dashboard",
    permission: null,
  },
  {
    href: "/admin/applications",
    label: "Applications",
    permission: "applications.view" as const,
  },
  {
    href: "/admin/users",
    label: "Users",
    permission: "users.manage" as const,
  },
  {
    href: "/admin/roles",
    label: "Roles & permissions",
    permission: "roles.manage" as const,
  },
  {
    href: "/admin/settings/donate",
    label: "Donate settings",
    permission: "settings.donate" as const,
  },
  {
    href: "/admin/settings/contact",
    label: "Contact settings",
    permission: "settings.contact" as const,
  },
  {
    href: "/admin/profile",
    label: "My profile",
    permission: null,
  },
];

export function AdminSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="bg-brand-green text-white p-5 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/95 p-1 shrink-0">
          <FoundationLogo alt="ASM Foundation" size="sidebar" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold leading-tight">
            ASM Board
          </p>
          <p className="text-xs text-brand-gold-soft mt-1">
            {user.fullName} · {user.roleName}
          </p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {items
          .filter(
            (item) =>
              !item.permission || hasPermission(user, item.permission),
          )
          .map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 ${
                  active ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
      </nav>
      <div className="mt-auto space-y-2 text-sm">
        <Link href="/en" className="block text-white/80 hover:text-white">
          View public site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="text-brand-gold-soft hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
