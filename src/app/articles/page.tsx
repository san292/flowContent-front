// src/app/articles/page.tsx
import { supabase } from "@/lib/supabase";

type ArticleCard = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  created_at?: string | null;
  image?: string | null;
};

const  ArticlesIndex=async()=> {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, description, slug, created_at, image")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur Supabase:", error.message);
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Tous les articles</h1>
        <p>Erreur de chargement.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tous les articles</h1>

      {!articles?.length ? (
        <p>Aucun article publié.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a: ArticleCard) => (
            <li key={a.id} className="border p-4 rounded-lg shadow-sm">
              {a.image ? (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              ) : null}
              <h2 className="text-xl font-semibold">{a.title}</h2>
              {a.description ? (
                <p className="text-gray-600 mt-2">{a.description}</p>
              ) : null}
              <a
                href={`/articles/${a.slug}`}
                className="text-blue-600 mt-3 inline-block"
              >
                Lire l’article →
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
export default ArticlesIndex