'use client';

import { useState, useEffect } from 'react';
import { videosSvdService } from '@/lib/videosSvd';
import { VideoJob } from '@/types/ApiTypes';
import VideoPlayer from './VideoPlayer';

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoJob | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videosSvdService.listMyVideos(50);
      setVideos(data);
    } catch (err: any) {
      console.error('Erreur chargement vidéos:', err);
      // Si l'endpoint n'existe pas encore, on affiche un message spécifique
      if (err.message?.includes('500') || err.message?.includes('404')) {
        setError('endpoint_not_ready');
      } else {
        setError(err.message || 'Erreur lors du chargement des vidéos');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    // Si l'endpoint n'est pas encore implémenté côté backend
    if (error === 'endpoint_not_ready') {
      return (
        <div className="rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-yellow-900">
            Galerie en cours de développement
          </h3>
          <p className="mt-2 text-sm text-yellow-700">
            L'endpoint backend <code className="rounded bg-yellow-100 px-2 py-1">/videos-svd/my-videos</code> n'est pas encore implémenté.
          </p>
          <p className="mt-2 text-sm text-yellow-600">
            Vos vidéos sont bien générées et stockées ! La galerie sera disponible prochainement.
          </p>
        </div>
      );
    }

    // Autre erreur
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-700">❌ {error}</p>
        <button
          onClick={loadVideos}
          className="mt-3 text-sm text-red-600 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Aucune vidéo générée
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Générez votre première vidéo ci-dessus pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Mes vidéos ({videos.length})
        </h3>
        <button
          onClick={loadVideos}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Modal vidéo */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="max-w-4xl w-full rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Vidéo {selectedVideo.jobId.slice(0, 8)}
              </h4>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {selectedVideo.videoUrl && (
              <VideoPlayer videoUrl={selectedVideo.videoUrl} />
            )}
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Créée le</p>
                <p className="font-medium">{formatDate(selectedVideo.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Durée</p>
                <p className="font-medium">{selectedVideo.duration?.toFixed(2)}s</p>
              </div>
              <div>
                <p className="text-gray-500">FPS</p>
                <p className="font-medium">{selectedVideo.fps}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grille de vidéos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.jobId}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Thumbnail/Preview */}
            {video.videoUrl && video.status === 'completed' ? (
              <div
                className="relative aspect-video cursor-pointer bg-black"
                onClick={() => setSelectedVideo(video)}
              >
                <video
                  src={video.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity hover:bg-opacity-30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-90">
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">
                  {video.status === 'processing' ? '⏳ Génération...' : '⏸️'}
                </span>
              </div>
            )}

            {/* Infos */}
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {video.jobId.slice(0, 12)}...
                </p>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                    video.status
                  )}`}
                >
                  {video.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <p>📅 {formatDate(video.createdAt)}</p>
                {video.duration && <p>⏱️ {video.duration.toFixed(2)}s</p>}
                {video.fps && <p>🎬 {video.fps} FPS</p>}
              </div>

              {video.status === 'processing' && video.progress && (
                <div className="mt-3">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
