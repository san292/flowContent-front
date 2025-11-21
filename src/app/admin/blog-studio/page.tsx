'use client';

import { useState } from 'react';
import VideoGenerator from './components/video/VideoGenerator';
import VideoGallery from './components/video/VideoGallery';

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
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-12 w-12 text-blue-600"
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
                Module Images Leonardo AI
              </h3>
              <p className="mt-2 text-gray-500">
                Génération d&apos;images avec Leonardo AI - Module à intégrer prochainement
              </p>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-8">
            {/* Générateur */}
            <div className="rounded-lg bg-white p-8 shadow">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Générateur de Vidéos SVD
              </h2>
              <VideoGenerator />
            </div>

            {/* Galerie */}
            <div className="rounded-lg bg-white p-8 shadow">
              <VideoGallery />
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="rounded-lg bg-white p-8 shadow">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Module Audio TTS
              </h3>
              <p className="mt-2 text-gray-500">
                Génération de voix avec Text-to-Speech - Bientôt disponible
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
