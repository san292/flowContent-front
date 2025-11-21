'use client';

interface VideoConfigPanelProps {
  motionBucketId: number;
  fps: number;
  frames: number;
  onMotionChange: (value: number) => void;
  onFpsChange: (value: number) => void;
  onFramesChange: (value: number) => void;
  onGenerate: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function VideoConfigPanel({
  motionBucketId,
  fps,
  frames,
  onMotionChange,
  onFpsChange,
  onFramesChange,
  onGenerate,
  loading,
  disabled,
}: VideoConfigPanelProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Configuration
      </h3>

      <div className="space-y-6">
        {/* Motion Bucket */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Intensité du mouvement</span>
            <span className="text-blue-600">{motionBucketId}</span>
          </label>
          <input
            type="range"
            min="1"
            max="255"
            value={motionBucketId}
            onChange={(e) => onMotionChange(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            1-255 (127 = équilibré)
          </p>
        </div>

        {/* FPS */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Images par seconde (FPS)</span>
            <span className="text-blue-600">{fps}</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={fps}
            onChange={(e) => onFpsChange(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">5-30 FPS</p>
        </div>

        {/* Frames */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Nombre de frames</span>
            <span className="text-blue-600">{frames}</span>
          </label>
          <input
            type="range"
            min="14"
            max="25"
            value={frames}
            onChange={(e) => onFramesChange(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            14-25 frames (≈ {(frames / fps).toFixed(1)}s)
          </p>
        </div>

        {/* Bouton génération */}
        <button
          onClick={onGenerate}
          disabled={disabled || loading}
          className="w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Génération...
            </span>
          ) : (
            '🎬 Générer la vidéo'
          )}
        </button>
      </div>
    </div>
  );
}
