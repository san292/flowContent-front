"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Components } from "react-markdown";
import Image from "next/image";

type MarkdownRendererProps ={
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // supprime les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const markdownComponents: Components = {
  h2({ children }) {
const text = React.Children.toArray(children).join("");

    const id = slugify(text);
    return (
      <h2
        id={id}
        className="mt-12 scroll-mt-24 border-b border-white/10 pb-2 text-2xl font-bold"
      >
        <a
          href={`#${id}`}
          className="no-underline hover:underline decoration-white/40"
        >
          {children}
        </a>
      </h2>
    );
  },

  p({ children }) {
    return <p className="leading-8 text-white/90">{children}</p>;
  },

  strong({ children }) {
    return <strong className="text-white">{children}</strong>;
  },

  em({ children }) {
    return <em className="text-white/80 not-italic">{children}</em>;
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-8 border-l-4 border-white/15 bg-white/5 p-4 text-white/90">
        {children}
      </blockquote>
    );
  },

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   code({ inline, children, className, ...props }: any) {
    if (inline) {
      return (
        <code
          className="rounded bg-white/10 px-1 py-0.5 text-[0.95em]"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-4 text-sm leading-7">
        <code {...props}>{children}</code>
      </pre>
    );
  },

  img({ src, alt }) {
    const safeSrc = typeof src === "string" ? src : "/assets/default.webp";
    return (
      <figure className="my-8 overflow-hidden rounded-xl border border-white/10">
        <Image
          src={safeSrc}
          alt={alt ?? ""}
          width={1200}
          height={630}
          className="h-auto w-full object-cover"
        />
        {alt && (
          <figcaption className="border-t border-white/10 bg-black/40 px-4 py-2 text-center text-xs text-white/70">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  ul({ children }) {
    return (
      <ul className="my-6 list-outside space-y-2 pl-6 marker:text-white/50">
        {children}
      </ul>
    );
  },

  ol({ children }) {
    return (
      <ol className="my-6 list-decimal space-y-2 pl-6 marker:text-white/50">
        {children}
      </ol>
    );
  },

  a({ href, children }) {
    return (
      <a
        href={href ?? "#"}
        className="text-sky-300 underline decoration-sky-500/40 underline-offset-4 hover:text-sky-200"
      >
        {children}
      </a>
    );
  },

  hr() {
    return <hr className="my-10 border-white/10" />;
  },
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const processed = content.replace(
    /(^\s*(?!#)[^.\n]+?\.)/,
    (m) =>
      `<span class="first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-extrabold first-letter:text-white">${m}</span>`
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={markdownComponents}
    >
      {processed}
    </ReactMarkdown>
  );
};
