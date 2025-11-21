"use client";

import { useState } from "react";
import Image from "next/image";
import { SocialMediaKit } from "@/types/ApiTypes";

interface SocialKitCardProps {
  kit: SocialMediaKit;
}

const networkIcons: { [key: string]: string } = {
  instagram: "📸",
  linkedin: "💼",
  twitter: "🐦",
  facebook: "👥",
  tiktok: "🎵",
};

const networkColors: { [key: string]: string } = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  linkedin: "bg-blue-600",
  twitter: "bg-sky-500",
  facebook: "bg-blue-700",
  tiktok: "bg-black",
};

export default function SocialKitCard({ kit }: SocialKitCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(kit.copyPasteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleDownloadImage = async () => {
    if (!kit.image) return;

    try {
      // Télécharger l'image depuis l'URL
      const response = await fetch(kit.image.url);
      const blob = await response.blob();

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${kit.network}-image.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement image:', error);
      // Fallback: ouvrir dans un nouvel onglet
      window.open(kit.image.url, "_blank");
    }
  };

  const handleDownloadText = () => {
    // Créer le contenu texte avec hashtags
    const textContent = kit.hashtags.length > 0
      ? `${kit.text}\n\n${kit.hashtags.join(' ')}`
      : kit.text;

    // Créer un blob avec le texte
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kit.network}-text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const networkColor = networkColors[kit.network.toLowerCase()] || "bg-gray-600";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${networkColor} text-white px-6 py-4`}>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span>{networkIcons[kit.network.toLowerCase()] || "📱"}</span>
          <span className="uppercase">{kit.network}</span>
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Image Preview */}
        {kit.image && !imageError && (
          <div className="relative rounded-lg overflow-hidden group">
            <Image
              src={kit.image.url}
              alt={`${kit.network} post image`}
              width={800}
              height={400}
              className="w-full h-auto object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
              {kit.image.generatedBy}
            </div>
          </div>
        )}

        {/* Text Content */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            📝 <span>Texte du post</span>
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
              {kit.text}
            </p>
          </div>
        </div>

        {/* Hashtags */}
        {kit.hashtags && kit.hashtags.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              🏷️ <span>Hashtags</span>
            </h4>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              {kit.hashtags.join(" ")}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyText}
            className={`flex-1 min-w-[180px] px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              copied
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {copied ? "✅ Copié !" : "📋 Copier le texte"}
          </button>
          <button
            onClick={handleDownloadText}
            className="flex-1 min-w-[180px] px-6 py-3 rounded-lg font-semibold border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200"
          >
            💾 Télécharger le texte
          </button>
          {kit.image && (
            <button
              onClick={handleDownloadImage}
              className="flex-1 min-w-[180px] px-6 py-3 rounded-lg font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-200"
            >
              🖼️ Télécharger l&apos;image
            </button>
          )}
        </div>

        {/* Instructions */}
        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
          <summary className="px-4 py-3 cursor-pointer font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            📖 Instructions de publication
          </summary>
          <div className="px-4 pb-4 pt-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {kit.instructions}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
