import { apiService } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditArticleForm from "./EditArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  let article;
  const {id}= await params

  try {
    article = await apiService.getArticleById(id);
  } catch (error) {
    console.error("Erreur chargement article:", error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/articles"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Éditer l'article
                </h1>
                <p className="mt-1 text-sm text-gray-500">{article.slug}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <EditArticleForm article={article} />
      </div>
    </main>
  );
}