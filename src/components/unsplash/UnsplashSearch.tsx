'use client';

import { useState, useRef, useCallback } from 'react';
import { unsplashService } from '@/lib/unsplash';
import { UnsplashPhoto } from '@/types/ApiTypes';

interface UnsplashSearchProps {
  onPhotoSelect: (photo: UnsplashPhoto) => void;
}

export default function UnsplashSearch({ onPhotoSelect }: UnsplashSearchProps) {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setPhotos([]);
      setCurrentPage(1);
      setHasMore(true);

      const response = await unsplashService.searchPhotos(query, 20, 1);
      setPhotos(response.results);
      setHasMore(response.total_pages > 1);

      if (response.results.length === 0) {
        setError('Aucune photo trouvée pour cette recherche');
      }
    } catch (err: any) {
      console.error('Erreur recherche Unsplash:', err);
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !query.trim()) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await unsplashService.searchPhotos(query, 20, nextPage);

      // Filtrer les doublons basés sur l'ID
      setPhotos((prev) => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPhotos = response.results.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPhotos];
      });

      setCurrentPage(nextPage);
      setHasMore(nextPage < response.total_pages);
    } catch (err: any) {
      console.error('Erreur chargement page suivante:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, query, currentPage]);

  // Callback ref pour l'élément sentinelle (infinite scroll)
  const lastPhotoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            loadMore();
          }
        },
        {
          // Options pour mieux contrôler le déclenchement
          rootMargin: '100px', // Commence à charger 100px avant la fin
          threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadingMore, loadMore]
  );

  const handlePhotoClick = (photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleConfirmSelection = async () => {
    if (!selectedPhoto) return;

    try {
      // Notifier Unsplash du téléchargement (requis par ToS)
      await unsplashService.triggerDownload(selectedPhoto.links.download_location);

      // Appeler le callback avec la photo sélectionnée
      // UnsplashManager se chargera de la sauvegarder dans la galerie
      onPhotoSelect(selectedPhoto);

      // Réinitialiser
      setSelectedPhoto(null);
      setQuery('');
      setPhotos([]);
    } catch (err: any) {
      console.error('Erreur sélection photo:', err);
      setError(err.message || 'Erreur lors de la sélection');
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de recherche */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher des photos (ex: technology, nature...)"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? '🔍 Recherche...' : '🔍 Rechercher'}
        </button>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {/* Résultats de recherche */}
      {photos.length > 0 && !loading && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {photos.length} résultats{' '}
            <span className="text-sm font-normal text-gray-500">
              (scroll pour charger plus)
            </span>
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                ref={index === photos.length - 1 ? lastPhotoRef : null}
                onClick={() => handlePhotoClick(photo)}
                className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                  selectedPhoto?.id === photo.id
                    ? 'border-purple-600 shadow-lg'
                    : 'border-transparent hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description || 'Photo Unsplash'}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Overlay avec infos */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-xs font-medium">Par {photo.user.name}</p>
                  {photo.alt_description && (
                    <p className="mt-1 line-clamp-2 text-xs opacity-90">
                      {photo.alt_description}
                    </p>
                  )}
                </div>

                {/* Indicateur de sélection */}
                {selectedPhoto?.id === photo.id && (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loader pour le chargement de plus de photos */}
          {loadingMore && (
            <div className="mt-8 flex items-center justify-center py-8">
              <div className="mr-3 h-6 w-6 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <span className="text-gray-600">Chargement de plus de photos...</span>
            </div>
          )}

          {/* Message fin de résultats */}
          {!hasMore && photos.length > 0 && (
            <div className="mt-8 text-center text-gray-500">
              <p className="text-sm">✨ Vous avez vu toutes les photos pour cette recherche</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmation */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-w-2xl w-full rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Confirmer la sélection
            </h3>

            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={selectedPhoto.urls.regular}
                alt={selectedPhoto.alt_description || 'Photo sélectionnée'}
                className="w-full"
              />
            </div>

            <div className="mb-6 space-y-2 text-sm text-gray-600">
              <p>
                <strong>Photographe:</strong> {selectedPhoto.user.name} (@
                {selectedPhoto.user.username})
              </p>
              {selectedPhoto.alt_description && (
                <p>
                  <strong>Description:</strong> {selectedPhoto.alt_description}
                </p>
              )}
              <p className="text-xs italic">
                Photo fournie par{' '}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Unsplash
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSelection}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              >
                Utiliser cette photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
