'use client';

import { useState, useEffect } from 'react';
import { videosSvdService } from '@/lib/videosSvd';
import { VideoJob } from '@/types/ApiTypes';
import VideoPlayer from './VideoPlayer';

interface VideoStatusCardProps {
  jobId: string;
  initialJob?: VideoJob;
  onComplete?: (videoUrl: string) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function VideoStatusCard({
  jobId,
  initialJob,
  onComplete,
  autoRefresh = true,
  refreshInterval = 5000,
}: VideoStatusCardProps) {
  const [job, setJob] = useState<VideoJob | null>(initialJob || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoRefresh || !job || job.status === 'completed' || job.status === 'failed') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const status = await videosSvdService.getVideoStatus(jobId);
        setJob(status);

        if (status.status === 'completed' && status.videoUrl) {
          onComplete?.(status.videoUrl);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [jobId, job, autoRefresh, refreshInterval, onComplete]);

  if (!job) return null;

  const getStatusColor = () => {
    switch (job.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'processing': return '⏳';
      default: return '⏸️';
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <h4 className="font-semibold text-gray-900">
              Vidéo {job.jobId.slice(0, 8)}
            </h4>
            <p className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor()}`}>
              {job.status}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {(job.status === 'pending' || job.status === 'processing') && (
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Progression</span>
            <span>{job.progress || 0}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${job.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Vidéo complétée */}
      {job.status === 'completed' && job.videoUrl && (
        <VideoPlayer videoUrl={job.videoUrl} />
      )}

      {/* Erreur */}
      {(job.status === 'failed' || error) && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {job.error || error}
        </div>
      )}

      {/* Métadonnées */}
      {job.duration && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Durée</p>
            <p className="font-medium">{job.duration?.toFixed(2)}s</p>
          </div>
          <div>
            <p className="text-gray-500">FPS</p>
            <p className="font-medium">{job.fps}</p>
          </div>
          <div>
            <p className="text-gray-500">Frames</p>
            <p className="font-medium">{job.frames}</p>
          </div>
        </div>
      )}
    </div>
  );
}
