"use client";

import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="md-body">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            if (match) {
              return (
                <CodeBlock className={className}>
                  {String(children).replace(/\n$/, "")}
                </CodeBlock>
              );
            }

            return (
              <code className="md-inline-code" {...props}>
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return <blockquote className="md-quote">{children}</blockquote>;
          },
          a({ href, children }) {
            const isExternal =
              typeof href === "string" && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                className={isExternal ? "external" : undefined}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
