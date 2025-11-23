import { request } from './apiHelpers';
import {
  UnsplashPhoto,
  SearchUnsplashResponse,
  SaveToGalleryRequest,
  GalleryPhoto,
} from '@/types/ApiTypes';

const UNSPLASH_BASE = '/unsplash';

/**
 * Rechercher des photos sur Unsplash
 */
export async function searchPhotos(
  query: string,
  perPage = 12,
  page = 1
): Promise<SearchUnsplashResponse> {
  return request<SearchUnsplashResponse>(
    `${UNSPLASH_BASE}/search?query=${encodeURIComponent(query)}&perPage=${perPage}&page=${page}`
  );
}

/**
 * Sauvegarder une photo Unsplash dans la galerie
 */
export async function saveToGallery(
  photo: UnsplashPhoto
): Promise<GalleryPhoto> {
  const saveData: SaveToGalleryRequest = {
    unsplashId: photo.id,
    imageUrl: photo.urls.regular,
    description: photo.alt_description || photo.description || 'Photo Unsplash',
    photographerName: photo.user.name,
    photographerUsername: photo.user.username,
    tags: '',
  };

  return request<GalleryPhoto>(`${UNSPLASH_BASE}/save-to-gallery`, {
    method: 'POST',
    body: JSON.stringify(saveData),
  });
}

/**
 * Lister toutes les photos de la galerie
 */
export async function listGallery(limit = 50): Promise<GalleryPhoto[]> {
  return request<GalleryPhoto[]>(`${UNSPLASH_BASE}/gallery?limit=${limit}`);
}

/**
 * Supprimer une photo de la galerie
 */
export async function deleteFromGallery(photoId: string): Promise<void> {
  return request<void>(`${UNSPLASH_BASE}/gallery/${photoId}`, {
    method: 'DELETE',
  });
}

/**
 * Notifier Unsplash du téléchargement (requis par ToS)
 */
export async function triggerDownload(downloadLocation: string): Promise<void> {
  return request<void>(`${UNSPLASH_BASE}/trigger-download`, {
    method: 'POST',
    body: JSON.stringify({ downloadLocation }),
  });
}

export const unsplashService = {
  searchPhotos,
  saveToGallery,
  listGallery,
  deleteFromGallery,
  triggerDownload,
};
