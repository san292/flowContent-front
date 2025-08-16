// app/[slug]/page.tsx
export const revalidate = 60;

import { formatDateUTC } from "@/lib/formateDate";
import { supabase } from "@/lib/supabase";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .limit(1);

  if (error) throw new Error(error.message);
  const row = data?.[0];
  if (!row) return <div className="max-w-3xl mx-auto p-6 text-gray-600">Article introuvable.</div>;

  let tags: string[] = [];
  if (Array.isArray(row.tags)) tags = row.tags;
  else if (typeof row.tags === "string") {
    try { tags = JSON.parse(row.tags); } catch {}
  }
  
  const dateStr = formatDateUTC(row.created_at, "fr-FR");
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-sm text-gray-500">
        {row.category ?? ""} {row.domain ? `· ${row.domain}` : ""} ·{dateStr}


      </p>
      <h1 className="mt-2 text-3xl font-bold">{row.title}</h1>
      {row.description && <p className="mt-2 text-gray-600">{row.description}</p>}

      <article className="prose max-w-none mt-6">
        <div dangerouslySetInnerHTML={{ __html: row.content }} />
      </article>

      {tags.length > 0 && (
        <p className="mt-8 text-sm text-gray-600">Tags : {tags.map((t) => `#${t}`).join(" · ")}</p>
      )}
    </main>
  );
}
