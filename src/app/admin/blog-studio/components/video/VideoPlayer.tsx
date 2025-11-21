'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  autoplay = false,
  loop = true,
  controls = true,
}: VideoPlayerProps) {
  const [loadError, setLoadError] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(videoUrl);
    alert('URL copiée dans le presse-papiers !');
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleError = () => {
    setLoadError(true);
    console.error('Erreur chargement vidéo:', videoUrl);
  };

  return (
    <div className="space-y-4">
      {loadError ? (
        <div className="rounded-lg bg-red-50 p-6">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold text-red-700">
              ❌ Impossible de charger la vidéo
            </p>
            <p className="mt-2 text-xs text-red-600 break-all">
              URL : {videoUrl}
            </p>
          </div>

          <div className="rounded bg-red-100 p-4 text-sm text-red-800">
            <p className="font-semibold mb-2">🔍 Causes possibles :</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Bucket Supabase pas public</li>
              <li>Problème CORS</li>
              <li>Format vidéo incompatible</li>
              <li>Fichier corrompu</li>
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setLoadError(false)}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              🔄 Réessayer
            </button>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-red-600 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              🔗 Tester l'URL
            </a>
            <button
              onClick={handleCopyUrl}
              className="rounded border border-red-600 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              📋 Copier URL
            </button>
          </div>

          <div className="mt-4 text-xs text-red-600">
            💡 Voir <code className="rounded bg-red-100 px-2 py-1">SUPABASE_VIDEO_FIX.md</code> pour les solutions
          </div>
        </div>
      ) : (
        <video
          src={videoUrl}
          autoPlay={autoplay}
          loop={loop}
          controls={controls}
          playsInline
          preload="metadata"
          muted={autoplay}
          onError={handleError}
          className="w-full rounded-lg bg-black"
          crossOrigin="anonymous"
        >
          <source src={videoUrl} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          📋 Copier URL
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          ⬇️ Télécharger
        </button>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          🔗 Ouvrir dans un nouvel onglet
        </a>
      </div>
    </div>
  );
}
