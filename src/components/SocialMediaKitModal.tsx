"use client";

import { useState, useEffect } from "react";
import { SocialMediaKit } from "@/types/ApiTypes";
import { generateSocialMediaKit, generateSocialMediaKitHTML } from "@/lib/api";
import SocialKitCard from "./SocialKitCard";

interface ArticleForKit {
  id: string;
  title: string;
  content: string;
  description?: string | null;
  tags?: string[] | null;
  slug?: string;
}

interface SocialMediaKitModalProps {
  article: ArticleForKit;
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialMediaKitModal({
  article,
  isOpen,
  onClose,
}: SocialMediaKitModalProps) {
  const [kits, setKits] = useState<{ [key: string]: SocialMediaKit } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("instagram");
  const [error, setError] = useState<string | null>(null);
  const [downloadingHTML, setDownloadingHTML] = useState(false);

  useEffect(() => {
    if (isOpen && !kits) {
      loadKits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadKits = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateSocialMediaKit({
        article: {
          title: article.title,
          content: article.content,
          description: article.description || "",
          tags: article.tags || [],
        },
        networks: ["instagram", "linkedin", "twitter", "facebook"],
        language: "fr",
      });

      setKits(response.data.kits);
      const firstNetwork = Object.keys(response.data.kits)[0];
      if (firstNetwork) {
        setSelectedNetwork(firstNetwork);
      }
    } catch (err) {
      console.error("Error generating social media kit:", err);
      setError("Erreur lors de la génération du kit. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAllAsHTML = async () => {
    if (!article) return;

    setDownloadingHTML(true);
    try {
      const html = await generateSocialMediaKitHTML({
        article: {
          title: article.title,
          content: article.content,
          description: article.description || "",
          tags: article.tags || [],
        },
        networks: ["instagram", "linkedin", "twitter", "facebook"],
        language: "fr",
      });

      // Create blob and download
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kit-social-media-${article.slug || article.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading HTML kit:", err);
      setError("Erreur lors du téléchargement du kit HTML.");
    } finally {
      setDownloadingHTML(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📱 <span>Kit Social Media</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  ⏳ Génération de vos posts en cours...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Création du texte optimisé...<br />
                  🎨 Génération des images (10-30s)...<br />
                  ✨ Finalisation...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
              <button
                onClick={loadKits}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {kits && !loading && (
            <div className="space-y-6">
              {/* Network Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
                {Object.keys(kits).map((network) => (
                  <button
                    key={network}
                    onClick={() => setSelectedNetwork(network)}
                    className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all duration-200 ${
                      selectedNetwork === network
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {network}
                  </button>
                ))}
              </div>

              {/* Selected Kit Card */}
              {kits[selectedNetwork] && (
                <SocialKitCard kit={kits[selectedNetwork]} />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {kits && !loading && (
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex flex-wrap gap-3 justify-between items-center border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={downloadAllAsHTML}
              disabled={downloadingHTML}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                downloadingHTML
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {downloadingHTML ? "⏳ Téléchargement..." : "📄 Télécharger le kit complet (HTML)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
