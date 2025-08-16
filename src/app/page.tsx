import { supabase } from "@/lib/supabase";

const  HomePage =async()=> {
  // Récupère uniquement les articles avec status = "published"
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, description, slug, created_at, image")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur Supabase:", error.message);
    return <p>Erreur lors du chargement des articles.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Articles publiés</h1>

      {articles && articles.length > 0 ? (
        <ul className="space-y-6">
          {articles.map((article) => (
            <li
              key={article.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600 mt-2">{article.description}</p>
              <a
                href={`/articles/${article.slug}`}
                className="text-blue-600 mt-3 inline-block"
              >
                Lire l'article →
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun article publié pour le moment.</p>
      )}
    </main>
  );
}
export default HomePage