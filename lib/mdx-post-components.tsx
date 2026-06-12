import type { ComponentType, HTMLAttributes, ReactNode } from "react";

type MdxComponents = Record<string, ComponentType<HTMLAttributes<HTMLElement>>>;
type MdxElProps = HTMLAttributes<HTMLElement> & { children?: ReactNode };

/**
 * Components map for /writing posts. Same prose treatment as the project
 * case-study renderer but without architecture-diagram injection (posts
 * use Mermaid-style code blocks for their own diagrams).
 */
export function makePostMdxComponents(): MdxComponents {
  return {
    h2: ({ children, ...props }: MdxElProps) => (
      <h2
        className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: MdxElProps) => (
      <h3
        className="mt-8 text-base font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }: MdxElProps) => (
      <p className="mt-3 text-pretty leading-relaxed text-foreground/85" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: MdxElProps) => (
      <ul className="mt-3 space-y-2 pl-5 text-foreground/85" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: MdxElProps) => (
      <ol
        className="mt-3 list-decimal space-y-2 pl-5 text-foreground/85"
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
        className="my-5 overflow-x-auto rounded-md border border-border bg-muted/50 p-4 font-mono text-[12.5px] leading-relaxed"
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
