"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { Article, UpdateArticleData } from "@/types/ApiTypes";
import Link from "next/link";
import SocialMediaKitModal from "@/components/SocialMediaKitModal";
import { UnsplashManager } from "@/components/unsplash";

type EditArticleFormProps = {
  article: Article;
};

export default function EditArticleForm({ article: initialArticle }: EditArticleFormProps) {
  const router = useRouter();
  const [article, setArticle] = useState<Article>(initialArticle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSocialKitModal, setShowSocialKitModal] = useState(false);
  const [showUnsplashSelector, setShowUnsplashSelector] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handlePhotoSelect = (imageUrl: string) => {
    setArticle({ ...article, image_url: imageUrl });
    setShowUnsplashSelector(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const currentTags = article.tags || [];
      if (!currentTags.includes(newTag.trim())) {
        setArticle({ ...article, tags: [...currentTags, newTag.trim()] });
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = article.tags || [];
    setArticle({ ...article, tags: currentTags.filter(tag => tag !== tagToRemove) });
  };

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
        image_url: article.image_url,
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

        {/* Image de l'article */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image de l'article
            </label>
            <button
              type="button"
              onClick={() => setShowUnsplashSelector(!showUnsplashSelector)}
              className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              {showUnsplashSelector ? "Masquer" : "📸 Choisir une photo"}
            </button>
          </div>

          {/* Aperçu de l'image actuelle */}
          {article.image_url && !showUnsplashSelector && (
            <div className="mt-4">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full max-w-2xl rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={() => setArticle({ ...article, image_url: undefined })}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Supprimer l'image
              </button>
            </div>
          )}

          {/* Sélecteur Unsplash */}
          {showUnsplashSelector && (
            <div className="mt-4 border-t pt-4">
              <UnsplashManager onPhotoSelect={handlePhotoSelect} />
            </div>
          )}

          {/* Message si pas d'image */}
          {!article.image_url && !showUnsplashSelector && (
            <p className="text-sm text-gray-500">
              Aucune image sélectionnée. Cliquez sur "Choisir une photo" pour ajouter une image depuis Unsplash.
            </p>
          )}
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

        {/* Tags */}
        <div className="rounded-lg bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tags
          </label>

          {/* Tags existants */}
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags && article.tags.length > 0 ? (
              article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                    title="Supprimer ce tag"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">Aucun tag. Appuyez sur Entrée pour ajouter des tags.</span>
            )}
          </div>

          {/* Input pour ajouter des tags */}
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Ajouter un tag (appuyez sur Entrée)"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Tapez un tag et appuyez sur Entrée pour l'ajouter
          </p>
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
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowSocialKitModal(true)}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700"
          >
            📱 Kit Social Media
          </button>

          <div className="flex space-x-4">
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
        </div>
      </form>

      {/* Modal Kit Social Media */}
      <SocialMediaKitModal
        article={article}
        isOpen={showSocialKitModal}
        onClose={() => setShowSocialKitModal(false)}
      />
    </>
  );
}