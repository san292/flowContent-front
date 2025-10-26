import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
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
  image_url?:string | null;
  category?: string | null;
  tags?: string[] | null;
  created_at?: string | null;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
      new Date(dateStr)
    );
  } catch {
    return "";
  }
}

export const revalidate = 60; // ISR: régénère au max toutes les 60s

export default async function ArticlePage({
  params,
}: {
   params: Promise<{ slug: string }>
}) {
  const { slug } = await params; 
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, title, description, content, slug, image, image_url, category, tags, created_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[Server] Supabase error:", error.message);
    notFound();
  }
  if (!data) notFound();

  const a = data as unknown as Article;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* breadcrumb */}
      <div className="mb-6 text-sm text-neutral-500">
        <Link href="/articles" className="hover:underline">
          Articles
        </Link>{" "}
        / <span className="text-neutral-700">{a.title}</span>
      </div>

      {/* title */}
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
        {a.title}
      </h1>

      {/* meta */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
        {a.category && (
          <span className="rounded-full bg-neutral-100 px-3 py-1">
            {a.category}
          </span>
        )}
        {a.created_at && (
          <span className="rounded-full bg-neutral-100 px-3 py-1">
            Publié le {formatDate(a.created_at)}
          </span>
        )}
      </div>

      {/* cover */}

      {(() => {
  return null;
})()}
{(a.image_url || a.image) && (
  <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl">
    <Image
      src={a.image_url || a.image || '/assets/default.webp'}  
      alt={a.title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 768px"
      priority={false}
    />
  </div>
)}

      {/* content (HTML) */}
     <article className="prose prose-neutral mt-8 max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    // rehypeRaw permet d’interpréter le HTML présent dans le markdown
    // rehypeSanitize évite les injections XSS
    rehypePlugins={[rehypeRaw, rehypeSanitize]}
  >
    {a.content}
  </ReactMarkdown>
</article>


      {/* tags */}
      {a.tags && a.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {a.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* back link */}
      <div className="mt-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-neutral-900 hover:text-neutral-600"
        >
          ← Retour aux articles
        </Link>
      </div>
    </main>
  );
}
