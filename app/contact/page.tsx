import type { Metadata } from "next";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Kicker } from "@/components/ui/kicker";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — email, LinkedIn, GitHub.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "abhishekcse2004@gmail.com",
    href: "mailto:abhishekcse2004@gmail.com",
    note: "Quickest reply — direct route for roles, freelance briefs, or technical conversations.",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/abhishekcse2004",
    href: "https://linkedin.com/in/abhishekcse2004",
    note: "Resume mirror + intro request route.",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Anshuu2004",
    href: "https://github.com/Anshuu2004",
    note: "Source for CodeHeal, Brosplit, AI QP Generator, DriveAware (repo name: CodeAware).",
  },
] as const;

export default function ContactPage() {
  return (
    <section className="space-y-16">
      <FadeUp>
        <header className="space-y-3">
          <Kicker>Contact</Kicker>
          <RevealText
            as="h1"
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Pick a channel.
          </RevealText>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Email is fastest. LinkedIn for intros. GitHub for code. I read all
            three.
          </p>
        </header>
      </FadeUp>

      <ul className="space-y-3">
        {CHANNELS.map((channel, i) => {
          const Icon = channel.icon;
          return (
            <FadeUp key={channel.label} delay={0.05 + i * 0.06}>
              <li>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-5 transition-colors duration-fast hover:border-foreground/40 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:p-6"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-colors group-hover:border-accent/60 group-hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {channel.label}
                    </p>
                    <p className="truncate font-medium text-foreground group-hover:text-accent">
                      {channel.value}
                      <ArrowUpRight
                        className="ml-1 inline h-3.5 w-3.5 -translate-y-px text-muted-foreground transition-colors group-hover:text-accent"
                        aria-hidden
                      />
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {channel.note}
                    </p>
                  </div>
                </a>
              </li>
            </FadeUp>
          );
        })}
      </ul>

      <FadeUp delay={0.32}>
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Calendar booking (Cal.com) lands in a follow-up · for now, propose a
          time via email
        </p>
      </FadeUp>
    </section>
  );
}
