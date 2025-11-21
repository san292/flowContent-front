// import { supabase } from "@/lib/supabase";
// import Link from "next/link";
// import Image from "next/image";

// type FeaturedArticle = {
//   id: string;
//   title: string;
//   description?: string | null;
//   slug: string;
//   created_at?: string | null;
//   image?: string | null;
//   image_url?: string | null;
//   category?: string | null;
// };

// function formatDate(dateStr?: string | null) {
//   if (!dateStr) return "";
//   try {
//     return new Intl.DateTimeFormat("fr-FR", {
//       dateStyle: "long",
//     }).format(new Date(dateStr));
//   } catch {
//     return "";
//   }
// }

// export default async function HomePage() {
//   // Récupère les 6 derniers articles publiés pour la homepage
//   const { data: articles, error } = await supabase
//     .from("articles")
//     .select(
//       "id, title, description, slug, created_at, image,image_url, category"
//     )
//     .eq("status", "published")
//     .order("created_at", { ascending: false })
//     .limit(6);

//   if (error) {
//     console.error("[Server] Erreur Supabase:", error.message);
//     return (
//       <main className="mx-auto max-w-7xl px-6 py-16">
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
//           Une erreur est survenue lors du chargement des articles.
//         </div>
//       </main>
//     );
//   }

//   const featuredArticle = articles?.[0];
//   const recentArticles = articles?.slice(1, 6) || [];

//   return (
//     <main className="mx-auto max-w-7xl px-6">
//       {/* Hero Section */}
//       <section className="py-16">
//         <div className="text-center">
//           <h1 className="text-5xl font-extrabold tracking-tight text-white-900 sm:text-6xl lg:text-7xl">
//             Votre Blog
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 sm:text-4xl lg:text-5xl">
//               La nouvelle façon de faire du Blogging
//             </span>
//           </h1>
//           <p className="mx-auto mt-6 max-w-2xl text-lg leading-10 text-white-6 600 ">
//             Découvrez des articles générés intelligemment, couvrant les sujets
//             les plus passionnants du moment. Du contenu frais et résumé, publié
//             automatiquement pour vous tenir informé.
//           </p>
//           <div className="mt-8 flex items-center justify-center gap-2">
//             <Link
//               href="/articles"
//               className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
//             >
//               Voir tous les articles
//             </Link>
//             <Link
//               href="#featured"
//               className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
//             >
//               Découvrir ↓
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured Article */}
//       {featuredArticle && (
//         <section id="featured" className="py-16">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold tracking-tight text-white-900">
//               Article à la une
//             </h2>
//             <p className="bg-red-500 text-white p-4">
//               Le dernier article publié sur le blog
//             </p>
//           </div>

//           <article className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
//             <div className="grid grid-cols-1 lg:grid-cols-2">
//               {/* Image */}
//               <div className="relative h-64 w-full bg-neutral-100 lg:h-full">
//                 {featuredArticle.image_url ? (
//                   <Image
//                     src={featuredArticle.image_url}
//                     alt={featuredArticle.title}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
//                     sizes="(max-width: 1024px) 100vw, 50vw"
//                     priority
//                   />
//                 ) : (
//                   <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100" />
//                 )}
//               </div>

//               {/* Content */}
//               <div className="flex flex-col justify-center p-8 lg:p-12">
//                 <div className="flex items-center gap-3 text-sm">
//                   {featuredArticle.category && (
//                     <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
//                       {featuredArticle.category}
//                     </span>
//                   )}
//                   {featuredArticle.created_at && (
//                     <span className="text-neutral-500">
//                       {formatDate(featuredArticle.created_at)}
//                     </span>
//                   )}
//                 </div>

//                 <h3 className="mt-4 text-2xl font-bold leading-tight text-neutral-900 lg:text-3xl">
//                   <Link
//                     href={`/articles/${featuredArticle.slug}`}
//                     className="outline-none transition-colors hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400"
//                   >
//                     {featuredArticle.title}
//                   </Link>
//                 </h3>

//                 <div className="mt-6">
//                   <Link
//                     href={`/articles/${featuredArticle.slug}`}
//                     className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
//                   >
//                     Lire l&&rsquo;article
//                     <svg
//                       className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.497-1.32l.083-.094L13.585 11H4a1 1 0 0 1-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 0 1 0-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </article>
//         </section>
//       )}

//       {/* Recent Articles Grid */}
//       {recentArticles.length > 0 && (
//         <section className="py-16">
//           <div className="mb-8 flex items-center justify-between">
//             <div>
//               <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
//                 Articles récents
//               </h2>
//               <p className="mt-2 text-neutral-600">
//                 Les dernières publications générées par L&rsquo;IA
//               </p>
//             </div>
//             <Link
//               href="/articles"
//               className="hidden text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600 sm:block"
//             >
//               Voir tout →
//             </Link>
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {recentArticles.map((article: FeaturedArticle) => (
//               <article
//                 key={article.id}
//                 className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
//               >
//                 {/* Image */}
//                 <div className="relative h-48 w-full bg-neutral-100">
//                   {article.image_url ? (
//                     <Image
//                       src={article.image_url}
//                       alt={article.title}
//                       fill
//                       className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
//                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                       priority={false}
//                     />
//                   ) : (
//                     <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
//                   )}

//                   {/* Category badge */}
//                   {article.category && (
//                     <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow">
//                       {article.category}
//                     </span>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-5">
//                   <h3 className="text-lg font-semibold leading-snug text-neutral-900">
//                     <Link
//                       href={`/articles/${article.slug}`}
//                       className="outline-none transition-colors hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400"
//                     >
//                       {article.title}
//                     </Link>
//                   </h3>

//                   {article.description && (
//                     <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
//                       {article.description}
//                     </p>
//                   )}

//                   <div className="mt-4 flex items-center justify-between">
//                     <Link
//                       href={`/articles/${article.slug}`}
//                       className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
//                     >
//                       Lire l&&rsquo;article
//                       <svg
//                         className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                         aria-hidden="true"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.497-1.32l.083-.094L13.585 11H4a1 1 0 0 1-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 0 1 0-1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </Link>

//                     {article.created_at && (
//                       <span className="text-xs text-neutral-500">
//                         {formatDate(article.created_at)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>

//           {/* Mobile "See all" button */}
//           <div className="mt-8 text-center sm:hidden">
//             <Link
//               href="/articles"
//               className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
//             >
//               Voir tous les articles
//               <svg
//                 className="h-4 w-4"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 .083 1.32l-.083.094-5 5a1 1 0 0 1-1.497-1.32l.083-.094L13.585 11H4a1 1 0 0 1-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 0 1 0-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </Link>
//           </div>
//         </section>
//       )}

//       {/* Empty State */}
//       {!articles?.length && (
//         <section className="py-16">
//           <div className="text-center">
//             <div className="mx-auto h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center">
//               <svg
//                 className="h-12 w-12 text-neutral-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="mt-4 text-lg font-semibold text-neutral-900">
//               Aucun article publié
//             </h3>
//             <p className="mt-2 text-neutral-600">
//               Votre système de génération d&rsquo;articles par IA n&rsquo;a pas encore
//               produit de contenu.
//             </p>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }
// app/page.tsx
// app/page.tsx

import Link from "next/link";
import Image from "next/image";
import { getPublicArticles } from "@/lib/api";

type Article = {
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
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
      new Date(dateStr)
    );
  } catch {
    return "";
  }
}

function CategoryBadge({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-900 shadow ring-1 ring-black/5">
      {children}
    </span>
  );
}

function Arrow() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01.083 1.32l-.083.094-5 5a1 1 0 01-1.497-1.32l.083-.094L13.585 11H4a1 1 0 01-.117-1.993L4 9h9.585l-3.292-3.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Force dynamic rendering to allow data fetching at runtime
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    const { articles } = await getPublicArticles({ limit: 1000 });
    const items = articles ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6">
      {/* HERO sobre & éditorial */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 py-14 sm:py-18">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_80%_-20%,rgba(59,130,246,.12),transparent),radial-gradient(800px_500px_at_-10%_120%,rgba(168,85,247,.10),transparent)]"
        />
        <div className="relative text-center">
          <p className="mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            Édition – analyses & tendances
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Le magazine <span className="text-white/70">propulsé par l&apos;IA</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Une ligne éditoriale nette, des visuels soignés, un ton professionnel. Le meilleur des sujets, publié automatiquement.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link
              href="/articles"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              Tous les articles
            </Link>
            <Link
              href="#magazine"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Explorer ↓
            </Link>
          </div>
        </div>
      </section>

      {/* MAGAZINE GRID — asymétrique, pro, sombre */}
      {items.length > 0 ? (
        <section id="magazine" className="py-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dernières publications
            </h2>
            <Link
              href="/articles"
              className="hidden text-sm font-medium text-white/80 hover:text-white sm:block"
            >
              Voir tout →
            </Link>
          </div>

          {/* Grille asymétrique */}
          <div className="grid auto-rows-[220px] grid-cols-1 gap-6 sm:grid-cols-6">
            {items.map((a, i) => {
              // Mapping des spans pour un effet magazine
              // 0 = très grand, 1 = grand tall, 2 = wide, autres = tuiles
              const span =
                i === 0
                  ? "sm:col-span-6 lg:col-span-4 lg:row-span-2"
                  : i === 1
                  ? "sm:col-span-3 lg:col-span-2 lg:row-span-2"
                  : i === 2
                  ? "sm:col-span-3 lg:col-span-2"
                  : "sm:col-span-3 lg:col-span-2";

              const isBig = i === 0;
              const hasImage = a.image_url || a.image;

              return (
                <article
                  key={a.id}
                  className={`group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 ${span}`}
                >
                  {/* media */}
                  <div className="absolute inset-0">
                    {hasImage ? (
                      <Image
                        src={a.image_url || a.image!}
                        alt={a.title}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                          isBig ? "" : ""
                        }`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i <= 2}
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#1c1c1c,#101010)]" />
                    )}
                    {/* Overlays pour lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
                  </div>

                  {/* contenu */}
                  <div
                    className={`relative z-10 flex h-full flex-col ${
                      isBig ? "p-6 lg:p-8 justify-end" : "p-5 justify-end"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {a.category && <CategoryBadge>{a.category}</CategoryBadge>}
                      {a.created_at && (
                        <time className="text-[11px] font-medium text-white/70">
                          {formatDate(a.created_at)}
                        </time>
                      )}
                    </div>

                    <h3
                      className={`font-bold text-white ${
                        isBig ? "text-2xl lg:text-3xl" : "text-lg leading-snug"
                      }`}
                    >
                      <Link
                        href={`/articles/${a.slug}`}
                        className="outline-none ring-offset-2 ring-offset-neutral-900 focus-visible:ring-2 focus-visible:ring-sky-300"
                      >
                        <span className="bg-gradient-to-t from-white via-white to-white/95 bg-clip-text text-transparent">
                          {a.title}
                        </span>
                      </Link>
                    </h3>

                    {isBig && a.description && (
                      <p className="mt-3 max-w-2xl text-sm text-white/80 line-clamp-3">
                        {a.description}
                      </p>
                    )}

                    <div className="mt-4">
                      <Link
                        href={`/articles/${a.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/15"
                      >
                        Lire l&apos;article <Arrow />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA mobile */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Voir tous les articles <Arrow />
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-inset ring-white/10">
              <svg
                className="h-10 w-10 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Aucun article publié</h3>
            <p className="mt-2 text-white/70">
              Revenez bientôt — de nouveaux contenus arrivent.
            </p>
          </div>
        </section>
      )}
    </main>
  );
   } catch (error: unknown) {
    console.error("[Frontend] Erreur API /articles/public:", error instanceof Error ? error.message : "Unknown error");
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-white">Tous les articles</h1>
        <p className="mt-4 rounded-lg border border-red-900/40 bg-red-900/20 px-4 py-3 text-red-200">
          Erreur lors du chargement des articles : {error instanceof Error ? error.message : "Inconnue"}
        </p>
      </main>
    );
  }
}
