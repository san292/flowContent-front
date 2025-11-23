'use client';

import { useState, useEffect } from 'react';
import { unsplashService } from '@/lib/unsplash';
import { GalleryPhoto } from '@/types/ApiTypes';

interface PhotoGalleryProps {
  onPhotoSelect?: (photo: GalleryPhoto) => void;
  selectable?: boolean;
}

export default function PhotoGallery({
  onPhotoSelect,
  selectable = false,
}: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unsplashService.listGallery();
      setPhotos(data);
    } catch (err: any) {
      console.error('Erreur chargement galerie:', err);
      setError(err.message || 'Erreur lors du chargement de la galerie');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;

    try {
      await unsplashService.deleteFromGallery(photoToDelete.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete.id));
      setPhotoToDelete(null);
    } catch (err: any) {
      console.error('Erreur suppression photo:', err);
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handlePhotoClick = (photo: GalleryPhoto) => {
    if (selectable && onPhotoSelect) {
      onPhotoSelect(photo);
    } else {
      setSelectedPhoto(photo);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-700">❌ {error}</p>
        <button
          type="button"
          onClick={loadGallery}
          className="mt-3 text-sm text-red-600 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (photos.length === 0) {
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Galerie vide
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Recherchez et sauvegardez des photos Unsplash pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Ma galerie ({photos.length} photos)
        </h3>
        <button
          type="button"
          onClick={loadGallery}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Grille de photos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Image */}
            <div
              onClick={() => handlePhotoClick(photo)}
              className="aspect-square cursor-pointer overflow-hidden bg-gray-100"
            >
              <img
                src={photo.image_url}
                alt={photo.description}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Overlay avec actions */}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setPhotoToDelete(photo)}
                className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
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

            {/* Infos */}
            <div className="p-3">
              <p className="line-clamp-2 text-sm text-gray-900">
                {photo.description}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Par {photo.photographer_name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de visualisation */}
      {selectedPhoto && !selectable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl w-full rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedPhoto.description}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.description}
                className="w-full"
              />
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Photographe:</strong> {selectedPhoto.photographer_name} (@
                {selectedPhoto.photographer_username})
              </p>
              <p>
                <strong>Ajoutée le:</strong>{' '}
                {new Date(selectedPhoto.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-w-md w-full rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Confirmer la suppression
            </h3>
            <p className="mb-6 text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette photo de votre galerie ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
