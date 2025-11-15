"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { Article, UpdateArticleData } from "@/types/ApiTypes";
import Link from "next/link";

type EditArticleFormProps = {
  article: Article;
};

export default function EditArticleForm({ article: initialArticle }: EditArticleFormProps) {
  const router = useRouter();
  const [article, setArticle] = useState<Article>(initialArticle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const updateData: UpdateArticleData = {
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category,
        domain: article.domain,
        author: article.author,
        tags: article.tags,
        status: article.status as "published" | "draft" | "archived",
      };

      await apiService.updateArticle(article.id, updateData);

      router.push("/admin/articles");
      router.refresh(); // Rafraîchir les données côté serveur
    } catch (err: any) {
      console.error("Erreur sauvegarde:", err);
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700">
            Titre
          </label>
          <input
            type="text"
            value={article.title}
            onChange={(e) =>
              setArticle({ ...article, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={article.description || ""}
            onChange={(e) =>
              setArticle({ ...article, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Contenu */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700">
            Contenu
          </label>
          <textarea
            value={article.content}
            onChange={(e) =>
              setArticle({ ...article, content: e.target.value })
            }
            rows={15}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Métadonnées */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <label className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <input
              type="text"
              value={article.category || ""}
              onChange={(e) =>
                setArticle({ ...article, category: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <label className="block text-sm font-medium text-gray-700">
              Domaine
            </label>
            <input
              type="text"
              value={article.domain || ""}
              onChange={(e) =>
                setArticle({ ...article, domain: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Auteur */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700">
            Auteur
          </label>
          <input
            type="text"
            value={article.author || ""}
            onChange={(e) =>
              setArticle({ ...article, author: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Statut */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            value={article.status}
            onChange={(e) =>
              setArticle({
                ...article,
                status: e.target.value as "published" | "draft" | "archived",
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/articles"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </form>
    </>
  );
}