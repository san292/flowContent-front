import { request } from './apiHelpers';
import { VideoJob, GenerateVideoRequest, VideoHealthResponse } from '@/types/ApiTypes';

const VIDEOS_BASE = '/videos-svd';

/**
 * Générer une vidéo à partir d'une image via SVD (Replicate)
 */
export async function generateVideo(data: GenerateVideoRequest): Promise<VideoJob> {
  return request<VideoJob>(`${VIDEOS_BASE}/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Récupérer le statut d'un job de génération vidéo
 */
export async function getVideoStatus(jobId: string): Promise<VideoJob> {
  return request<VideoJob>(`${VIDEOS_BASE}/status/${jobId}`);
}

/**
 * Lister toutes mes vidéos générées
 */
export async function listMyVideos(limit = 50): Promise<VideoJob[]> {
  return request<VideoJob[]>(`${VIDEOS_BASE}/my-videos?limit=${limit}`);
}

/**
 * Vérifier la santé du service vidéo
 */
export async function checkVideoHealth(): Promise<VideoHealthResponse> {
  return request<VideoHealthResponse>(`${VIDEOS_BASE}/health`);
}

export const videosSvdService = {
  generateVideo,
  getVideoStatus,
  listMyVideos,
  checkVideoHealth,
};
