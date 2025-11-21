'use client';

import { useState } from 'react';
import { videosSvdService } from '@/lib/videosSvd';
import { VideoJob } from '@/types/ApiTypes';
import VideoConfigPanel from './VideoConfigPanel';
import VideoStatusCard from './VideoStatusCard';

interface VideoGeneratorProps {
  imageUrl?: string;
  onComplete?: (videoUrl: string) => void;
  articleId?: string;
  domainId?: string;
}

export default function VideoGenerator({
  imageUrl: initialImageUrl,
  onComplete,
  articleId,
  domainId,
}: VideoGeneratorProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || '');
  const [job, setJob] = useState<VideoJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Config vidéo
  const [motionBucketId, setMotionBucketId] = useState(127);
  const [fps, setFps] = useState(6);
  const [frames, setFrames] = useState(14);

  const handleGenerate = async () => {
    if (!imageUrl) {
      setError('Veuillez fournir une URL d\'image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await videosSvdService.generateVideo({
        imageUrl,
        motionBucketId,
        fps,
        frames,
        articleId,
        domainId,
      });

      setJob(result);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const handleJobComplete = (videoUrl: string) => {
    onComplete?.(videoUrl);
  };

  return (
    <div className="space-y-6">
      {/* Preview image */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Image source
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {imageUrl && (
            <div className="overflow-hidden rounded-lg border">
              <img
                src={imageUrl}
                alt="Source"
                className="h-auto w-full"
              />
            </div>
          )}
        </div>

        {/* Config panel */}
        <VideoConfigPanel
          motionBucketId={motionBucketId}
          fps={fps}
          frames={frames}
          onMotionChange={setMotionBucketId}
          onFpsChange={setFps}
          onFramesChange={setFrames}
          onGenerate={handleGenerate}
          loading={loading}
          disabled={!imageUrl}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Job status */}
      {job && (
        <VideoStatusCard
          jobId={job.jobId}
          initialJob={job}
          onComplete={handleJobComplete}
        />
      )}
    </div>
  );
}
