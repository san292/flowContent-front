"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Article = {
  id: string;
  title: string;
  description?: string;
  slug: string;
  status: string;
  category?: string;
  topic?: string;
  original_topic?: string;
  author?: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  tags?: string[];
};

type FilterType = "all" | "published" | "draft" | "pending";

const ArticlesManagement = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  // const fetchArticles = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("articles")
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (error) throw error;
  //     setArticles(data || []);
  //   } catch (error) {
  //     console.error("Erreur lors du chargement des articles:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchArticles = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/articles`
    );
    
    if (!response.ok) throw new Error('Erreur API');
    
    const data = await response.json();
    setArticles(data.articles || []);
  } catch (error) {
    console.error("Erreur lors du chargement des articles:", error);
  } finally {
    setLoading(false);
  }
}

  const filterArticles = useCallback(() => {
  let filtered = articles;

  // Filtrer par statut
  if (filter !== "all") {
    filtered = filtered.filter((article) => article.status === filter);
  }

  // Filtrer par recherche
  if (searchTerm) {
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        article.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.original_topic
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  setFilteredArticles(filtered);
}, [articles, filter, searchTerm]);

  const updateArticleStatus = async (id: string, newStatus: string) => {
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const updates: any = { status: newStatus };

      if (newStatus === "published") {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      // Mettre à jour localement
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id
            ? {
                ...article,
                status: newStatus,
                published_at: updates.published_at || article.published_at,
              }
            : article
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;

      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      error: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Non défini";
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateStr));
  };

  const getStatusCounts = () => {
    return {
      all: articles.length,
      published: articles.filter((a) => a.status === "published").length,
      draft: articles.filter((a) => a.status === "draft").length,
      pending: articles.filter((a) => a.status === "pending").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600">
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
                  Gestion des articles
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredArticles.length} article(s) affiché(s)
                </p>
              </div>
            </div>
            <Link
              href="/admin/topics"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Nouveau sujet
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Filtres et recherche */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filtres par statut */}
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            {[
              { key: "all", label: `Tous (${statusCounts.all})` },
              {
                key: "published",
                label: `Publiés (${statusCounts.published})`,
              },
              { key: "draft", label: `Brouillons (${statusCounts.draft})` },
              { key: "pending", label: `En attente (${statusCounts.pending})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="rounded-lg bg-white shadow">
          {filteredArticles.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {article.title}
                        </h3>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                            article.status
                          )}`}
                        >
                          {article.status}
                        </span>
                      </div>

                      {article.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {article.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        {article.category && (
                          <span>Catégorie: {article.category}</span>
                        )}
                        {article.original_topic && (
                          <span>Sujet: {article.original_topic}</span>
                        )}
                        {article.author && (
                          <span>Auteur: {article.author}</span>
                        )}
                        <span>Créé: {formatDate(article.created_at)}</span>
                        {article.published_at && (
                          <span>
                            Publié: {formatDate(article.published_at)}
                          </span>
                        )}
                      </div>

                      {article.tags &&
                        Array.isArray(article.tags) &&
                        article.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="inline-flex rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">
                                +{article.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="ml-4 flex items-center space-x-2">
                      {/* Actions rapides */}
                      {article.status === "draft" && (
                        <button
                          onClick={() =>
                            updateArticleStatus(article.id, "published")
                          }
                          className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Publier
                        </button>
                      )}

                      {article.status === "published" && (
                        <button
                          onClick={() =>
                            updateArticleStatus(article.id, "draft")
                          }
                          className="rounded-md bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700"
                        >
                          Dépublier
                        </button>
                      )}

                      {/* Liens d'action */}
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir l'article"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>

                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-400 hover:text-red-600"
                        title="Supprimer"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun article trouvé
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter !== "all"
                  ? "Modifiez vos filtres pour voir plus d'articles."
                  : "Créez votre premier sujet pour générer des articles."}
              </p>
              {!searchTerm && filter === "all" && (
                <div className="mt-6">
                  <Link
                    href="/admin/topics"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    Créer un sujet
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default ArticlesManagement;
