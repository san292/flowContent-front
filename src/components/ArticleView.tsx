"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

type Article = {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  category?: string | null;
  tags?: string[] | null;
  created_at?: string | null;
  author?: string | null;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
      new Date(dateStr!)
    );
  } catch {
    return "";
  }
}

type Theme = "dark-editorial" | "light-journal";

export default function ArticleView({ article }: { article: Article }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark-editorial";
    return (localStorage.getItem("articleTheme") as Theme) || "dark-editorial";
  });
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasBody = Boolean(article?.content?.trim());
  const hasTags = Boolean(article?.tags && article?.tags.length > 0);

  useEffect(() => {
    localStorage.setItem("articleTheme", theme);
    document.documentElement.style.colorScheme =
      theme === "dark-editorial" ? "dark" : "light";
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const pct =
        total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const cover = article?.image_url || article?.image || "/assets/default.webp";

  const isDark = theme === "dark-editorial";

  const pageClasses = isDark
    ? "bg-neutral-950 text-neutral-200"
    : "bg-neutral-50 text-neutral-900";

  const cardClasses = isDark
    ? "bg-neutral-900/60 border-neutral-800"
    : "bg-white border-neutral-200";

  const chipClasses = isDark
    ? "bg-neutral-800 text-neutral-200 border-neutral-700"
    : "bg-neutral-100 text-neutral-700 border-neutral-200";

  const gradientTitle = isDark
    ? "bg-gradient-to-br from-neutral-0 via-neutral-200 to-blue-300"
    : "bg-gradient-to-br from-neutral-900 via-neutral-700 to-blue-700";

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://example.com/articles/${article?.slug}`;

  const shareText = encodeURIComponent(article?.title);

  const readingTime = useMemo(() => {
    const words = article?.content?.split(/\s+/g).length ?? 0;
    return Math.max(1, Math.round(words / 220)); // ~220 wpm
  }, [article?.content]);

  return (
    <main className={`min-h-screen ${pageClasses}`}>
      {/* Reading progress bar */}
      <div className="sticky top-0 z-50 h-1 w-full bg-transparent">
        <div
          className={`h-1 transition-[width] duration-150 ease-linear ${
            isDark ? "bg-blue-400" : "bg-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header / breadcrumb */}
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <nav className="text-sm">
            <Link
              href="/articles"
              className={`hover:underline ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Articles
            </Link>{" "}
            <span className={isDark ? "text-neutral-500" : "text-neutral-400"}>
              /
            </span>{" "}
            <span className={isDark ? "text-neutral-300" : "text-neutral-800"}>
              {article?.title}
            </span>
          </nav>

          {/* Theme switch */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Thème
            </span>
            <div className="inline-flex overflow-hidden rounded-full border border-neutral-400/30">
              <button
                onClick={() => setTheme("dark-editorial")}
                className={`px-3 py-1 text-xs font-medium ${
                  theme === "dark-editorial"
                    ? isDark
                      ? "bg-neutral-800 text-white"
                      : "bg-neutral-900 text-white"
                    : isDark
                    ? "text-neutral-400"
                    : "text-neutral-600"
                }`}
              >
                Editorial
              </button>
              <button
                onClick={() => setTheme("light-journal")}
                className={`px-3 py-1 text-xs font-medium ${
                  theme === "light-journal"
                    ? "bg-neutral-100 text-neutral-900"
                    : isDark
                    ? "text-neutral-400"
                    : "text-neutral-600"
                }`}
              >
                Journal
              </button>
            </div>
          </div>
        </div>

        {/* Title + meta */}
        <header className="mb-6">
          <h1
            className={`text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <span className={`bg-clip-text text-transparent ${gradientTitle}`}>
              {article?.title}
            </span>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {article?.category && (
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${chipClasses}`}
              >
                {article?.category}
              </span>
            )}
            {article?.created_at && (
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${chipClasses}`}
              >
                Publié le {formatDate(article?.created_at)}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${chipClasses}`}
            >
              ~ {readingTime} min de lecture
            </span>
          </div>
        </header>
      </div>

      {/* Cover image full bleed */}
      {(article?.image_url || article?.image) && (
        <div className="relative mx-auto mb-10 aspect-[21/9] w-full max-w-6xl overflow-hidden rounded-3xl">
          <Image
            src={article?.image_url || article?.image || ""}
            alt={article?.title}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority={false}
          />
          <div
            className={`absolute inset-0 pointer-events-none ${
              isDark
                ? "bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"
                : "bg-gradient-to-t from-neutral-50/20 via-transparent to-transparent"
            }`}
          />
        </div>
      )}

      {/* Article + aside */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-[1fr_320px]">
        {/* Article body */}
        <article
          ref={contentRef}
          className={`prose max-w-none rounded-2xl border p-6 sm:p-8 ${cardClasses} ${
            isDark
              ? "prose-invert prose-headings:scroll-mt-24 prose-a:text-blue-300 hover:prose-a:text-blue-200 prose-hr:border-neutral-800"
              : "prose-neutral prose-a:text-blue-700 hover:prose-a:text-blue-800"
          }`}
        >
          {article?.description && (
            <p
              className={`mb-6 text-lg leading-8 ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              {article?.description}
            </p>
          )}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              img: (props) => (
                // assure des images responsive dans le contenu
                <img {...props} className="mx-auto rounded-lg" />
              ),
              h2: (props) => (
                <h2
                  {...props}
                  className={`mt-10 scroll-mt-24 border-l-4 pl-3 ${
                    isDark ? "border-blue-400" : "border-blue-600"
                  }`}
                />
              ),
              blockquote: (props) => (
                <blockquote
                  {...props}
                  className={`border-l-4 pl-4 ${
                    isDark
                      ? "border-neutral-700 bg-neutral-900/40"
                      : "border-neutral-200 bg-neutral-50"
                  }`}
                />
              ),
            }}
          >
            {article?.content}
          </ReactMarkdown>

          {/* Tags */}
          {article?.tags && article?.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {article?.tags.map((t) => (
                <span
                  key={t}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    isDark
                      ? "border-neutral-700 bg-neutral-900/60 text-neutral-200"
                      : "border-neutral-200 bg-neutral-100 text-neutral-700"
                  }`}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
          {/* Divider */}

          {(hasBody || hasTags) && (
            <div
              className={`my-10 h-px w-full bg-gradient-to-r from-transparent to-transparent ${
                isDark ? "via-neutral-700/50" : "via-neutral-300"
              }`}
            />
          )}

          {/* Author + share */}
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div
                className={`grid h-12 w-12 place-items-center rounded-full text-base font-bold ${
                  isDark ? "bg-neutral-800" : "bg-neutral-200"
                }`}
              >
                {(article?.author || "Auteur")[0]?.toUpperCase() ?? "A"}
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Écrit par
                </p>
                <p className={isDark ? "text-white" : "text-neutral-900"}>
                  {article?.author || "Rédaction"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                    : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                }`}
              >
                Copier le lien
              </button>
              <a
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    : "bg-blue-600/10 text-blue-700 hover:bg-blue-600/20"
                }`}
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Partager X
              </a>
              <a
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    : "bg-blue-600/10 text-blue-700 hover:bg-blue-600/20"
                }`}
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* Aside (table des matières minimal + “plus d’articles”) */}
        <aside className="sticky top-20 h-fit space-y-6">
          <div className={`rounded-2xl border p-5 ${cardClasses}`}>
            <h3
              className={`mb-3 text-sm font-semibold ${
                isDark ? "text-neutral-200" : "text-neutral-900"
              }`}
            >
              Lecture
            </h3>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-400/20">
              <div
                className={`h-full ${
                  isDark ? "bg-blue-400" : "bg-blue-600"
                } transition-[width] duration-150`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p
              className={`mt-2 text-xs ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {Math.round(progress)}% lu
            </p>
          </div>

          <div className={`rounded-2xl border p-5 ${cardClasses}`}>
            <h3
              className={`mb-3 text-sm font-semibold ${
                isDark ? "text-neutral-200" : "text-neutral-900"
              }`}
            >
              Continuer
            </h3>
            <Link
              href="/articles"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                isDark
                  ? "bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                  : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              }`}
            >
              Voir tous les articles →
            </Link>
          </div>
        </aside>
      </div>

      {/* Footer spacer */}
      <div className="h-16" />
    </main>
  );
}
