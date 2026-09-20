"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const items: [string, string, string][] = [
  ["⌂", "Dashboard", "/dashboard"],
  ["▦", "Products", "/products"],
  ["⇄", "Stock", "/stock"],
  ["◒", "Sales", "/sales"],
  ["▤", "Transactions", "/transactions"],
  ["⚙", "Settings", "/settings"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (
    ["/", "/login", "/register"].includes(pathname) ||
    pathname.startsWith("/auth")
  ) {
    return <>{children}</>;
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand">
          <span className="brand-mark">MSM</span>
          <span className="brand-text">
            MY STOCK
            <br />
            MANAGER
          </span>
        </Link>
        <span className="nav-label">MAIN MENU</span>
        <nav className="nav">
          {items.map(([icon, name, href]) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? "active" : ""}
            >
              <span className="nav-icon">{icon}</span>
              {name}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="main">
        <header className="header">
          <span className="page-title">My Stock Manager</span>
          <div className="header-actions">
            <span className="avatar">MSM</span>
          </div>
        </header>
        {children}
      </main>
      <nav className="mobile-bar">
        {items.slice(0, 5).map(([icon, name, href]) => (
          <Link
            key={href}
            href={href}
            className={isActive(href) ? "active" : ""}
          >
            <span>{icon}</span>
            {name}
          </Link>
        ))}
      </nav>
    </div>
  );
}