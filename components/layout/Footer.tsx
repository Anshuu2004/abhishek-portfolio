const SOCIAL_LINKS = [
  { href: "mailto:abhishekcse2004@gmail.com", label: "Email" },
  { href: "https://github.com/Anshuu2004", label: "GitHub" },
  { href: "https://linkedin.com/in/abhishekcse2004", label: "LinkedIn" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">© {year} Abhishek Choudhary</p>
        <nav className="flex gap-5">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
