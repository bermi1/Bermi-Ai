"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
  /** When set, bracketed [n] citation markers become clickable chips. */
  onCitationClick?: (index: number) => void;
  hasCitations?: boolean;
  className?: string;
}

/** Convert bare [n] citation markers into markdown links to #cite-n so the
 * custom `a` renderer can turn them into chips. */
function linkifyCitations(content: string): string {
  return content.replace(/(?<!\]\()\[(\d{1,2})\](?!\()/g, "[$1](#cite-$1)");
}

export default function Markdown({ content, onCitationClick, hasCitations, className }: Props) {
  const processed = hasCitations ? linkifyCitations(content) : content;
  return (
    <div className={`prose-bermi ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const match = href?.match(/^#cite-(\d+)$/);
            if (match && onCitationClick) {
              const idx = parseInt(match[1], 10);
              return (
                <button
                  type="button"
                  className="citation-chip"
                  title={`View source ${idx}`}
                  onClick={() => onCitationClick(idx)}
                >
                  {idx}
                </button>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
