// src/app/articles/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  image?: string | null;
  slug: string;
  category?: string | null;
  domain?: string | null;
  created_at?: string | null;
};

const ArticlePage=async({ params }: { params: { slug: string } }) =>{
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return notFound();

  const a = data as Article;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{a.title}</h1>
          {a.image ? (
            <img
              src={a.image}
              alt={a.title}
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
          ) : null}
          {a.description ? (
            <p className="mt-4 text-gray-700">{a.description}</p>
          ) : null}
        </header>

        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: a.content }}
        />
      </article>
    </main>
  );
}
export default ArticlePage