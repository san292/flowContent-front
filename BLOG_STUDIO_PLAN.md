# Plan d'implémentation : Blog Studio

## 🎯 Objectif

Créer une page centralisée **Blog Studio** (`/admin/blog-studio`) qui regroupe tous les outils de génération de contenu multimédia :
- Images (Leonardo AI)
- Vidéos (SVD/Replicate)
- Audio (TTS - futur)

---

## 🏗️ Architecture

### Structure de fichiers

```
/src/app/admin/blog-studio/
├── page.tsx                          # Page principale avec système d'onglets
├── layout.tsx                        # Layout spécifique (optionnel)
│
├── /components/
│   ├── StudioTabs.tsx               # Navigation entre Image/Vidéo/Audio
│   ├── ImageStudio.tsx              # Module génération d'images
│   ├── VideoStudio.tsx              # Module génération vidéos ⭐ NOUVEAU
│   ├── AudioStudio.tsx              # Module génération audio (placeholder)
│   ├── MediaGallery.tsx             # Galerie unifiée tous médias
│   │
│   └── /video/                      # Composants vidéo
│       ├── VideoGenerator.tsx       # Formulaire + génération
│       ├── VideoStatusCard.tsx      # Suivi progression d'un job
│       ├── VideoPlayer.tsx          # Lecteur vidéo avec contrôles
│       ├── VideoConfigPanel.tsx     # Sliders config (motion, fps, frames)
│       ├── VideoGallery.tsx         # Liste vidéos générées
│       └── VideoJobsList.tsx        # Liste jobs en cours
│
/src/lib/
├── videosSvd.ts                     # Services API vidéos ⭐ NOUVEAU
│
/src/types/
└── ApiTypes.ts                      # Types vidéo à ajouter ⭐
```

---

## 📐 Design UX/UI

### Page principale : Système d'onglets

```
┌──────────────────────────────────────────────────────────┐
│ Blog Studio                              [User] [Logout] │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  [📸 Images] [🎬 Vidéos] [🎙️ Audio]  ← Tabs              │
│                                                           │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Contenu dynamique selon l'onglet sélectionné            │
│                                                           │
│  • Onglet Images → ImageStudio                           │
│  • Onglet Vidéos → VideoStudio                           │
│  • Onglet Audio → AudioStudio                            │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Onglet Vidéos (VideoStudio)

```
┌─────────────────────────────────────────────────────────────┐
│  Générateur de Vidéos                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌──────────────────────────────┐ │
│  │                     │  │  Configuration                │ │
│  │  Preview Image      │  │                               │ │
│  │  [Image source]     │  │  Mouvement: [===========] 127 │ │
│  │                     │  │  FPS:       [=====] 6         │ │
│  │                     │  │  Frames:    [======] 14       │ │
│  │  [Upload] [Sélect.] │  │                               │ │
│  └─────────────────────┘  │  [🎬 Générer la vidéo]        │ │
│                           └──────────────────────────────┘ │
│                                                             │
│  Jobs en cours                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Video-123  [████████░░] 75% - Processing...        │   │
│  │ Video-122  [██████████] 100% ✅ Completed           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Mes vidéos                                                 │
│  ┌───────────┬───────────┬───────────┬───────────┐         │
│  │ [Video 1] │ [Video 2] │ [Video 3] │ [Video 4] │         │
│  │ 2.3s      │ 2.5s      │ 1.8s      │ 2.1s      │         │
│  │ [Play]    │ [Play]    │ [Play]    │ [Play]    │         │
│  └───────────┴───────────┴───────────┴───────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Implémentation technique

### Phase 1 : Types TypeScript ⭐

**Fichier** : `/src/types/ApiTypes.ts`

Ajouter les types suivants :

```typescript
// ===== TYPES VIDÉOS SVD =====

export type VideoJob = {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  duration?: number;
  fps?: number;
  frames?: number;
  provider?: 'replicate';
  progress?: number;
  createdAt: string;
  completedAt?: string;
  error?: string | null;
  articleId?: string;
  domainId?: string;
};

export type GenerateVideoRequest = {
  imageUrl: string;
  motionBucketId?: number;  // 1-255, défaut: 127
  fps?: number;              // 5-30, défaut: 6
  frames?: number;           // 14-25, défaut: 14
  seed?: number;
  domainId?: string;
  articleId?: string;
};

export type VideoHealthResponse = {
  healthy: boolean;
  provider: string;
};
```

---

### Phase 2 : Services API ⭐

**Fichier** : `/src/lib/videosSvd.ts` (NOUVEAU)

```typescript
import { request } from './apiHelpers';
import { VideoJob, GenerateVideoRequest, VideoHealthResponse } from '@/types/ApiTypes';

const VIDEOS_BASE = '/videos-svd';

// Générer une vidéo
export async function generateVideo(data: GenerateVideoRequest): Promise<VideoJob> {
  return request<VideoJob>(`${VIDEOS_BASE}/generate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Récupérer le statut d'un job
export async function getVideoStatus(jobId: string): Promise<VideoJob> {
  return request<VideoJob>(`${VIDEOS_BASE}/status/${jobId}`);
}

// Lister mes vidéos
export async function listMyVideos(limit = 50): Promise<VideoJob[]> {
  return request<VideoJob[]>(`${VIDEOS_BASE}/my-videos?limit=${limit}`);
}

// Health check
export async function checkVideoHealth(): Promise<VideoHealthResponse> {
  return request<VideoHealthResponse>(`${VIDEOS_BASE}/health`);
}

export const videosSvdService = {
  generateVideo,
  getVideoStatus,
  listMyVideos,
  checkVideoHealth,
};
```

**Mise à jour** : `/src/lib/api.ts`

Ajouter à la fin :

```typescript
// Exports vidéo
export * from './videosSvd';
```

---

### Phase 3 : Composants Vidéo

#### 3.1 VideoGenerator

**Fichier** : `/src/app/admin/blog-studio/components/video/VideoGenerator.tsx`

```typescript
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
```

#### 3.2 VideoConfigPanel

**Fichier** : `/src/app/admin/blog-studio/components/video/VideoConfigPanel.tsx`

```typescript
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
```

#### 3.3 VideoStatusCard

**Fichier** : `/src/app/admin/blog-studio/components/video/VideoStatusCard.tsx`

```typescript
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
    </div>
  );
}
```

#### 3.4 VideoPlayer

**Fichier** : `/src/app/admin/blog-studio/components/video/VideoPlayer.tsx`

```typescript
'use client';

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
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(videoUrl);
    // TODO: Ajouter un toast de confirmation
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video-${Date.now()}.mp4`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <video
        src={videoUrl}
        autoPlay={autoplay}
        loop={loop}
        controls={controls}
        className="w-full rounded-lg"
      />

      <div className="flex gap-2">
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
      </div>
    </div>
  );
}
```

---

### Phase 4 : Page Blog Studio

**Fichier** : `/src/app/admin/blog-studio/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import VideoGenerator from './components/video/VideoGenerator';

type StudioTab = 'images' | 'videos' | 'audio';

export default function BlogStudioPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>('videos');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Blog Studio
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Centre de création multimédia (images, vidéos, audio)
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('images')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              📸 Images (Leonardo AI)
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              🎬 Vidéos (SVD)
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'audio'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              disabled
            >
              🎙️ Audio (Bientôt)
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'images' && (
          <div className="rounded-lg bg-white p-8 shadow">
            <p className="text-gray-500">
              Module Images Leonardo AI à intégrer ici
            </p>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="rounded-lg bg-white p-8 shadow">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Générateur de Vidéos SVD
            </h2>
            <VideoGenerator />
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="rounded-lg bg-white p-8 shadow">
            <p className="text-gray-500">
              Module Audio TTS - Bientôt disponible
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
```

---

## 🔗 Intégration dans la navigation

**Fichier** : `/src/components/Navbar.tsx`

Ajouter dans les liens admin :

```tsx
<Link
  href="/admin/blog-studio"
  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700"
>
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
  Blog Studio
</Link>
```

---

## 📋 Checklist d'implémentation

### MVP (Phase 1 - maintenant)
- [ ] Ajouter types vidéo dans `ApiTypes.ts`
- [ ] Créer service `videosSvd.ts`
- [ ] Créer `VideoGenerator.tsx`
- [ ] Créer `VideoConfigPanel.tsx`
- [ ] Créer `VideoStatusCard.tsx`
- [ ] Créer `VideoPlayer.tsx`
- [ ] Créer page `/admin/blog-studio/page.tsx`
- [ ] Ajouter lien dans Navbar
- [ ] Tester génération vidéo end-to-end

### Phase 2 (amélioration)
- [ ] Créer `VideoGallery.tsx` (liste vidéos)
- [ ] Créer `VideoJobsList.tsx` (jobs en cours)
- [ ] Intégrer Leonardo AI dans onglet Images
- [ ] Ajouter sélection d'images depuis galerie
- [ ] Templates de mouvement (zoom, pan, etc.)

### Phase 3 (avancé)
- [ ] Module Audio TTS
- [ ] Galerie unifiée (images + vidéos + audio)
- [ ] Export multi-plateforme (TikTok, Instagram, etc.)
- [ ] Batch generation
- [ ] Analytics d'utilisation

---

## 🎯 Points d'attention

1. **Polling intelligent** : Utiliser des intervalles adaptatifs (5s → 10s → 30s)
2. **Gestion d'erreurs** : Toasts pour les erreurs réseau
3. **Performance** : Lazy loading des vidéos dans la galerie
4. **UX** : Loading states partout
5. **Responsive** : Grid adaptatif mobile/desktop
6. **Backend URL** : Utiliser `API_BASE_URL` de `/src/lib/config.ts`

---

## 🚀 Ordre d'implémentation recommandé

1. **Types** → `ApiTypes.ts`
2. **Service** → `videosSvd.ts`
3. **Composants atomiques** → VideoPlayer, VideoConfigPanel
4. **Composants composés** → VideoStatusCard, VideoGenerator
5. **Page** → Blog Studio avec tabs
6. **Navigation** → Navbar

---

Prêt à commencer l'implémentation ? 🎬
