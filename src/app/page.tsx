// import { supabase } from "@/lib/supabase";

// const  HomePage =async()=> {
//   // Récupère uniquement les articles avec status = "published"
//   const { data: articles, error } = await supabase
//     .from("articles")
//     .select("id, title, description, slug, created_at, image")
//     .eq("status", "published")
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Erreur Supabase:", error.message);
//     return <p>Erreur lors du chargement des articles.</p>;
//   }

//   return (
//     <main className="max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Articles publiés</h1>

//       {articles && articles.length > 0 ? (
//         <ul className="space-y-6">
//           {articles.map((article) => (
//             <li
//               key={article.id}
//               className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
//             >
//               {article.image && (
//                 <img
//                   src={article.image}
//                   alt={article.title}
//                   className="w-full h-48 object-cover rounded mb-4"
//                 />
//               )}
//               <h2 className="text-xl font-semibold">{article.title}</h2>
//               <p className="text-gray-600 mt-2">{article.description}</p>
//               <a
//                 href={`/articles/${article.slug}`}
//                 className="text-blue-600 mt-3 inline-block"
//               >
//                 Lire l'article →
//               </a>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>Aucun article publié pour le moment.</p>
//       )}
//     </main>
//   );
// }
// export default HomePage
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type FeaturedArticle = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  created_at?: string | null;
  image?: string | null;
  image_url?: string | null;
  category?: string | null;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
    }).format(new Date(dateStr));
  } catch {
    return "";
  }
}

export default async function HomePage() {
  // Récupère les 6 derniers articles publiés pour la homepage
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, description, slug, created_at, image,image_url, category")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("[Server] Erreur Supabase:", error.message);
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Une erreur est survenue lors du chargement des articles.
        </div>
      </main>
    );
  }

  const featuredArticle = articles?.[0];
  const recentArticles = articles?.slice(1, 6) || [];

  return (
    <main className="mx-auto max-w-7xl px-6">
      {/* Hero Section */}
      <section className="py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white-900 sm:text-6xl lg:text-7xl">
            Votre Blog
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 sm:text-4xl lg:text-5xl">
              La nouvelle façon de faire du Blogging
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-10 text-white-6 600 ">
            Découvrez des articles générés intelligemment, couvrant les sujets les plus passionnants 
            du moment. Du contenu frais et résumé, publié automatiquement pour vous tenir informé.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Link
              href="/articles"
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              Voir tous les articles
            </Link>
            <Link
              href="#featured"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
            >
              Découvrir ↓
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section id="featured" className="py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white-900">
              Article à la une
            </h2>
            <p className="bg-red-500 text-white p-4">
              Le dernier article publié sur le blog
            </p>
          </div>

          <article className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 w-full bg-neutral-100 lg:h-full">
                {featuredArticle.image_url ? (
                  <Image
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="flex items-center gap-3 text-sm">
                  {featuredArticle.category && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
                      {featuredArticle.category}
                    </span>
                  )}
                  {featuredArticle.created_at && (
                    <span className="text-neutral-500">
                      {formatDate(featuredArticle.created_at)}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-bold leading-tight text-neutral-900 lg:text-3xl">
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="outline-none transition-colors hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    {featuredArticle.title}
                  </Link>
                </h3>

                {/* {featuredArticle.description && (
                  <p className="mt-4 text-neutral-600 lg:text-lg">
                    {featuredArticle.description}
                  </p>
                )} */}

                <div className="mt-6">
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
                  >
                    Lire l'article
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.497-1.32l.083-.094L13.585 11H4a1 1 0 0 1-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 0 1 0-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Recent Articles Grid */}
      {recentArticles.length > 0 && (
        <section className="py-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Articles récents
              </h2>
              <p className="mt-2 text-neutral-600">
                Les dernières publications générées par l'IA
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600 sm:block"
            >
              Voir tout →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article: FeaturedArticle) => (
              <article
                key={article.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-neutral-100">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                  )}
                  
                  {/* Category badge */}
                  {article.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow">
                      {article.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold leading-snug text-neutral-900">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="outline-none transition-colors hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {article.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
                      {article.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                    >
                      Lire l'article
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.497-1.32l.083-.094L13.585 11H4a1 1 0 0 1-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 0 1 0-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>

                    {article.created_at && (
                      <span className="text-xs text-neutral-500">
                        {formatDate(article.created_at)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile "See all" button */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
            >
              Voir tous les articles
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.497-1.32l.083-.094L13.585 11H4a1 1 0 0 1-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 0 1 0-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!articles?.length && (
        <section className="py-16">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">
              Aucun article publié
            </h3>
            <p className="mt-2 text-neutral-600">
              Votre système de génération d'articles par IA n'a pas encore produit de contenu.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}