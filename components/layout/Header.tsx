"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { CommandMenu } from "@/components/command-menu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          <span className="inline-flex items-center gap-0.5">
            <span className="text-muted-foreground">
              {logoHovered ? "~/" : ""}
            </span>
            <span>{logoHovered ? "abhishek" : "abhishek.dev"}</span>
            {logoHovered && (
              <span className="ml-0.5 inline-block h-3.5 w-[1.5px] animate-pulse bg-accent align-middle" />
            )}
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="ml-1.5 inline-block h-1 w-1 rounded-full bg-accent align-middle"
                  />
                )}
              </Link>
            );
          })}
          <span
            aria-hidden
            className="mx-1 hidden h-4 w-px bg-border/60 sm:block"
          />
          <CommandMenu />
        </nav>
      </div>
    </header>
  );
}
