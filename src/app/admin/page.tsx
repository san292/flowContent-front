import { supabase } from "@/lib/supabase";
import Link from "next/link";

type AdminStats = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  todayArticles: number;
};

type RecentArticle = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  slug: string;
};

async function getAdminStats(): Promise<AdminStats> {
  const today = new Date().toISOString().split("T")[0];

  const [total, published, drafts, todayCount] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact" }),
    supabase
      .from("articles")
      .select("id", { count: "exact" })
      .eq("status", "published"),
    supabase
      .from("articles")
      .select("id", { count: "exact" })
      .eq("status", "draft"),
    supabase
      .from("articles")
      .select("id", { count: "exact" })
      .gte("created_at", today),
  ]);

  return {
    totalArticles: total.count || 0,
    publishedArticles: published.count || 0,
    draftArticles: drafts.count || 0,
    todayArticles: todayCount.count || 0,
  };
}

async function getRecentArticles(): Promise<RecentArticle[]> {
  const { data } = await supabase
    .from("articles")
    .select("id, title, status, created_at, slug")
    .order("created_at", { ascending: false })
    .limit(10);

  return data || [];
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

function getStatusBadge(status: string) {
  const styles = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    pending: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
  };

  return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
}

const AdminDashboard = async () => {
  const [stats, recentArticles] = await Promise.all([
    getAdminStats(),
    getRecentArticles(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Admin
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez votre blog automatisé par IA
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/topics"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Nouveau sujet
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Voir le blog
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Articles publiés
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.publishedArticles}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Brouillons
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.draftArticles}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Aujourd&apos;hui
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.todayArticles}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total articles
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalArticles}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Actions rapides
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <Link
                  href="/admin/topics/new"
                  className="flex w-full items-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="mx-auto">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="mt-2 block text-sm font-medium text-gray-700">
                      Ajouter un sujet
                    </span>
                  </div>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Paramètres
                </Link>

                <Link
                  href="/admin/analytics"
                  className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Analytics
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Articles */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Articles récents
                  </h3>
                  <Link
                    href="/admin/articles"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Voir tout
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentArticles.length > 0 ? (
                  recentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="px-6 py-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {article.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(article.created_at)}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                              article.status
                            )}`}
                          >
                            {article.status}
                          </span>
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500">Aucun article trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default AdminDashboard;
