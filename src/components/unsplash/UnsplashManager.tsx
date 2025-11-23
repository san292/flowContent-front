'use client';

import { useState } from 'react';
import { unsplashService } from '@/lib/unsplash';
import { UnsplashPhoto, GalleryPhoto } from '@/types/ApiTypes';
import UnsplashSearch from './UnsplashSearch';
import PhotoGallery from './PhotoGallery';

interface UnsplashManagerProps {
  onPhotoSelect?: (imageUrl: string, photoData: UnsplashPhoto | GalleryPhoto) => void;
}

export default function UnsplashManager({ onPhotoSelect }: UnsplashManagerProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'gallery'>('search');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePhotoSelect = async (photo: UnsplashPhoto | GalleryPhoto) => {
    try {
      setSaving(true);
      setMessage(null);

      let savedPhoto: GalleryPhoto;

      // Vérifier si c'est déjà une photo de galerie (a déjà un storage_path)
      if ('storage_path' in photo) {
        // C'est déjà une GalleryPhoto
        savedPhoto = photo as GalleryPhoto;
      } else {
        // C'est une UnsplashPhoto, il faut la sauvegarder
        savedPhoto = await unsplashService.saveToGallery(photo as UnsplashPhoto);
        setMessage({
          type: 'success',
          text: '✅ Photo sauvegardée dans votre galerie !',
        });
      }

      // Si un callback est fourni, l'appeler avec l'URL de la photo
      if (onPhotoSelect) {
        onPhotoSelect(savedPhoto.image_url, savedPhoto);
      }

      // Basculer vers la galerie après 1 seconde
      setTimeout(() => {
        setActiveTab('gallery');
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      console.error('Erreur sauvegarde photo:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Erreur lors de la sauvegarde',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryPhotoSelect = (photo: GalleryPhoto) => {
    if (onPhotoSelect) {
      onPhotoSelect(photo.image_url, photo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          🔍 Rechercher sur Unsplash
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'gallery'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          📸 Ma galerie
        </button>
      </div>

      {/* Messages de feedback */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* État de sauvegarde */}
      {saving && (
        <div className="flex items-center justify-center rounded-lg bg-purple-50 p-4">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
          <span className="text-purple-700">Sauvegarde en cours...</span>
        </div>
      )}

      {/* Contenu des onglets */}
      <div className="min-h-[400px]">
        {activeTab === 'search' ? (
          <UnsplashSearch onPhotoSelect={handlePhotoSelect} />
        ) : (
          <PhotoGallery
            onPhotoSelect={onPhotoSelect ? handleGalleryPhotoSelect : undefined}
            selectable={!!onPhotoSelect}
          />
        )}
      </div>

      {/* Info Unsplash */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          <strong>À propos:</strong> Les photos proviennent d'{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            Unsplash
          </a>
          , une plateforme de photos libres de droits de haute qualité. Pensez à créditer
          les photographes lorsque vous utilisez leurs photos.
        </p>
      </div>
    </div>
  );
}
