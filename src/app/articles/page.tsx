// // src/app/articles/[slug]/page.tsx
// import { notFound } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// type Article = {
//   id: string;
//   title: string;
//   description?: string | null;
//   content: string;
//   image?: string | null;
//   slug: string;
//   category?: string | null;
//   domain?: string | null;
//   created_at?: string | null;
// };

// const ArticlePage=async({ params }: { params: { slug: string } }) =>{
//   const { data, error } = await supabase
//     .from("articles")
//     .select("*")
//     .eq("slug", params.slug)
//     .eq("status", "published")
//     .maybeSingle();

//   if (error || !data) return notFound();

//   const a = data as Article;

//   return (
//     <main className="max-w-3xl mx-auto px-4 py-8">
//       <article>
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold">{a.title}</h1>
//           {a.image ? (
//             <img
//               src={a.image}
//               alt={a.title}
//               className="w-full h-64 object-cover rounded-lg mt-4"
//             />
//           ) : null}
//           {a.description ? (
//             <p className="mt-4 text-gray-700">{a.description}</p>
//           ) : null}
//         </header>

//         <div
//           className="prose prose-neutral max-w-none"
//           dangerouslySetInnerHTML={{ __html: a.content }}
//         />
//       </article>
//     </main>
//   );
// }
// export default ArticlePage
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type ArticleCard = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  created_at?: string | null;
  image?: string | null;
  image_url?: string | null;
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

export default async function ArticlesIndex() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, description, slug, created_at, image, image_url")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Server] Erreur Supabase:", error.message);
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          Tous les articles
        </h1>
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Une erreur est survenue lors du chargement des articles.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          Tous les articles
        </h1>
        <p className="mt-3 text-neutral-500">
          Les dernières publications, mises en page avec douceur et lisibilité.
        </p>
      </header>

      {/* Empty state */}
      {!articles?.length ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
          <p className="text-neutral-600">
            Aucun article publié pour le moment.
          </p>
        </div>
      ) : (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a: ArticleCard) => (
            <article
              key={a.id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Media */}
              <div className="relative h-48 w-full bg-neutral-100">
                {a.image_url ? (
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                )}
                {/* Date badge */}
                {a.created_at && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow">
                    {formatDate(a.created_at)}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex h-full flex-col p-5">
                <h2 className="text-lg font-semibold leading-snug text-neutral-900">
                  <Link
                    href={`/articles/${a.slug}`}
                    className="outline-none transition-colors hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    {a.title}
                  </Link>
                </h2>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/articles/${a.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                  >
                    Lire l’article
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

                  {/* Subtle dot separator with date (mobile hidden as already in badge) */}
                  {a.created_at && (
                    <span className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
                      <span className="h-1 w-1 rounded-full bg-neutral-300" />
                      {formatDate(a.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
