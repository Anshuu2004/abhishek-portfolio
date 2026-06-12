"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  ArrowRight,
  FileText,
  FolderGit2,
  Github,
  Home,
  Linkedin,
  Mail,
  Search,
  Terminal,
  User,
} from "lucide-react";

const EMAIL = "abhishekcse2004@gmail.com";
const GITHUB = "https://github.com/Anshuu2004";
const LINKEDIN = "https://www.linkedin.com/in/abhishekcse2004";

const PAGES = [
  { label: "Home", href: "/", icon: Home },
  { label: "Work", href: "/work", icon: FolderGit2 },
  { label: "Writing", href: "/writing", icon: FileText },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: Mail },
];

// Mirrors content/projects and content/posts. Kept inline so the palette
// stays a pure client component (the content loader is build-time / fs-only).
const PROJECTS = [
  { label: "Simption ERP", href: "/work/simption-erp" },
  { label: "CodeHeal", href: "/work/codeheal" },
  { label: "DriveAware", href: "/work/driveaware" },
  { label: "AI Question Paper Generator", href: "/work/ai-question-paper-generator" },
  { label: "Brosplit", href: "/work/brosplit" },
];

const POSTS = [
  { label: "Multi-tenant SaaS in Laravel 13", href: "/writing/multi-tenant-laravel-13" },
  { label: "OpenVINO FP16 vs FP32 benchmarks", href: "/writing/openvino-fp16-benchmarks" },
  { label: "CodeHeal RAG pipeline", href: "/writing/codeheal-rag-pipeline" },
  { label: "Brosplit debt simplification", href: "/writing/brosplit-debt-simplification" },
];

// Terminal commands answer inline — the menu doubles as a tiny shell.
const TERMINAL: { cmd: string; out: string }[] = [
  {
    cmd: "whoami",
    out: "Abhishek Choudhary — AI-native full-stack engineer. Multi-tenant SaaS by day, AI products on real foundations always.",
  },
  {
    cmd: "stack",
    out: "Next.js 15 · React 19 · TypeScript · Laravel 13 · Python · OpenVINO · Gemini · Supabase · PostgreSQL · Redis · Docker",
  },
  {
    cmd: "metrics",
    out: "30 FPS edge ML on CPU · 1000+ institution architecture · 20+ self-registering modules · 6 languages auto-fixed",
  },
  {
    cmd: "sudo hire-me",
    out: "permission granted ✓ — opening mail client…",
  },
];

const HIRE_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "SDE role — let's talk"
)}`;

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [output, setOutput] = useState<{ cmd: string; out: string } | null>(
    null
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Clear the shell output whenever the palette closes.
  useEffect(() => {
    if (!open) setOutput(null);
  }, [open]);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const runTerminal = useCallback((entry: { cmd: string; out: string }) => {
    setOutput(entry);
    if (entry.cmd === "sudo hire-me") {
      window.setTimeout(() => {
        window.location.href = HIRE_MAILTO;
      }, 900);
    }
  }, []);

  const go = useCallback(
    (href: string) =>
      run(() => router.push(href as Parameters<typeof router.push>[0])),
    [router, run]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
        className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/60 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors duration-fast hover:border-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-border/70 bg-muted/60 px-1 text-[10px] leading-4 sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-[18%] z-50 w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-black/40"
          >
            <Dialog.Title className="sr-only">Command menu</Dialog.Title>
            <Command
              loop
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <div className="flex items-center gap-2 border-b border-border px-3">
                <Search
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <Command.Input
                  autoFocus
                  placeholder="Jump to a page, project, or post…"
                  className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-1.5">
                <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results.
                </Command.Empty>

                <Command.Group heading="Pages">
                  {PAGES.map((p) => (
                    <Item key={p.href} value={p.label} onSelect={() => go(p.href)}>
                      <p.icon
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      {p.label}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Projects">
                  {PROJECTS.map((p) => (
                    <Item key={p.href} value={p.label} onSelect={() => go(p.href)}>
                      <ArrowRight
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      {p.label}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Writing">
                  {POSTS.map((p) => (
                    <Item key={p.href} value={p.label} onSelect={() => go(p.href)}>
                      <FileText
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      {p.label}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Terminal">
                  {TERMINAL.map((t) => (
                    <Item
                      key={t.cmd}
                      value={t.cmd}
                      onSelect={() => runTerminal(t)}
                    >
                      <Terminal
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="font-mono text-[13px]">{t.cmd}</span>
                    </Item>
                  ))}
                  <Item
                    value="hire"
                    onSelect={() =>
                      run(() => {
                        window.location.href = HIRE_MAILTO;
                      })
                    }
                  >
                    <Terminal
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="font-mono text-[13px]">hire</span>
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      opens mail
                    </span>
                  </Item>
                </Command.Group>

                <Command.Group heading="Contact">
                  <Item
                    value="Copy email"
                    onSelect={() =>
                      run(() => navigator.clipboard?.writeText(EMAIL))
                    }
                  >
                    <Mail
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                    Copy email
                  </Item>
                  <Item
                    value="GitHub"
                    onSelect={() =>
                      run(() => window.open(GITHUB, "_blank", "noopener,noreferrer"))
                    }
                  >
                    <Github
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                    GitHub
                  </Item>
                  <Item
                    value="LinkedIn"
                    onSelect={() =>
                      run(() =>
                        window.open(LINKEDIN, "_blank", "noopener,noreferrer")
                      )
                    }
                  >
                    <Linkedin
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden
                    />
                    LinkedIn
                  </Item>
                </Command.Group>
              </Command.List>

              {output && (
                <div
                  aria-live="polite"
                  className="space-y-1 border-t border-border bg-muted/30 px-4 py-3"
                >
                  <p className="font-mono text-[11px] text-muted-foreground">
                    <span className="text-accent">›</span> {output.cmd}
                  </p>
                  <p className="font-mono text-xs leading-relaxed text-foreground">
                    {output.out}
                  </p>
                </div>
              )}
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Item({
  value,
  onSelect,
  children,
}: {
  value: string;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground outline-none transition-colors duration-fast data-[selected=true]:bg-muted/70"
    >
      {children}
    </Command.Item>
  );
}
