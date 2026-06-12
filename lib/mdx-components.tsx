import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import { ARCH_DIAGRAMS } from "@/components/diagram/registry";
import { DiagramReveal } from "@/components/diagram/DiagramReveal";

type MdxComponents = Record<string, ComponentType<HTMLAttributes<HTMLElement>>>;
type MdxElProps = HTMLAttributes<HTMLElement> & { children?: ReactNode };

/**
 * Builds the components map MDXRemote uses to render the project case-study
 * body. The `slug` is captured so the H2 "Architecture" injects the right
 * hand-tuned SVG inline.
 */
export function makeProjectMdxComponents(slug: string): MdxComponents {
  const Diagram = ARCH_DIAGRAMS[slug];

  return {
    h2: ({ children, ...props }: MdxElProps) => {
      const text = typeof children === "string" ? children : null;
      const isArch = text === "Architecture";
      return (
        <>
          <h2
            className="mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
            {...props}
          >
            {children}
          </h2>
          {isArch && Diagram && (
            <div className="my-6 rounded-lg border border-border bg-muted/20 p-4 text-foreground sm:p-6">
              <DiagramReveal>
                <Diagram />
              </DiagramReveal>
            </div>
          )}
        </>
      );
    },
    h3: ({ children, ...props }: MdxElProps) => (
      <h3
        className="mt-8 text-base font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }: MdxElProps) => (
      <p
        className="mt-3 text-pretty leading-relaxed text-muted-foreground"
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({ children, ...props }: MdxElProps) => (
      <ul className="mt-3 space-y-2 pl-5 text-muted-foreground" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: MdxElProps) => (
      <ol
        className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: MdxElProps) => (
      <li
        className="relative pl-1 leading-relaxed marker:text-muted-foreground/50"
        {...props}
      >
        {children}
      </li>
    ),
    a: ({ children, ...props }: MdxElProps) => {
      const anchorProps = props as HTMLAttributes<HTMLAnchorElement> & {
        href?: string;
      };
      const isExternal = !!anchorProps.href?.startsWith("http");
      return (
        <a
          className="link-draw text-foreground"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...anchorProps}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children, ...props }: MdxElProps) => (
      <blockquote
        className="my-4 border-l-2 border-accent/60 bg-muted/30 py-2 pl-4 text-sm italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }: MdxElProps) => (
      <code
        className="rounded-sm border border-border/60 bg-muted/50 px-1 py-0.5 font-mono text-[13px]"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }: MdxElProps) => (
      <pre
        className="my-4 overflow-x-auto rounded-md border border-border bg-muted/50 p-4 font-mono text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    ),
    strong: ({ children, ...props }: MdxElProps) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: MdxElProps) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),
    hr: (props: MdxElProps) => (
      <hr className="my-8 border-t border-border/60" {...props} />
    ),
  } as unknown as MdxComponents;
}

export type ProjectMdxComponents = ReturnType<typeof makeProjectMdxComponents>;

export type MdxChildren = { children?: ReactNode };
