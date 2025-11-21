"use client";

import { useState } from "react";

type CopyButtonProps = {
  content: string;
  label?: string;
};

function CopyButton({ content, label = "Copier" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copié !
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

type TwitterPreviewProps = {
  text: string;
  hashtags: string[];
  cardStyle?: string;
};

export function TwitterPreview({ text, hashtags, cardStyle }: TwitterPreviewProps) {
  const fullContent = `${text}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <div>
              <p className="font-bold text-neutral-900">Twitter / X</p>
              <p className="text-xs text-neutral-500">Format: {cardStyle || "Tweet standard"}</p>
            </div>
          </div>
          <CopyButton content={fullContent} />
        </div>
      </div>

      {/* Tweet Content */}
      <div className="p-4 bg-white">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
            <div>
              <p className="font-bold text-sm">Votre compte</p>
              <p className="text-xs text-neutral-500">@votre_compte</p>
            </div>
          </div>
        </div>

        <p className="text-neutral-900 whitespace-pre-wrap mb-3">{text}</p>

        <div className="flex flex-wrap gap-1.5">
          {hashtags.map((tag, i) => (
            <span key={i} className="text-[#1DA1F2] hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* Tweet Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 text-neutral-500">
          <div className="flex items-center gap-1 text-sm hover:text-[#1DA1F2] cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-green-500 cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-red-500 cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-1 text-sm hover:text-[#1DA1F2] cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

type LinkedInPreviewProps = {
  text: string;
  hashtags: string[];
  format?: string;
};

export function LinkedInPreview({ text, hashtags, format }: LinkedInPreviewProps) {
  const fullContent = `${text}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <div>
              <p className="font-bold text-neutral-900">LinkedIn</p>
              <p className="text-xs text-neutral-500">Format: {format || "Post standard"}</p>
            </div>
          </div>
          <CopyButton content={fullContent} />
        </div>
      </div>

      {/* LinkedIn Post */}
      <div className="p-4 bg-white">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">Votre Nom</p>
            <p className="text-xs text-neutral-600">Votre titre professionnel</p>
            <p className="text-xs text-neutral-500">Maintenant</p>
          </div>
        </div>

        <p className="text-neutral-900 whitespace-pre-wrap mb-3 leading-relaxed">{text}</p>

        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, i) => (
            <span key={i} className="text-[#0A66C2] font-medium hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* LinkedIn Actions */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-neutral-100">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-neutral-600 hover:bg-neutral-50 rounded transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="text-sm font-medium">J&apos;aime</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-neutral-600 hover:bg-neutral-50 rounded transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Commenter</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-neutral-600 hover:bg-neutral-50 rounded transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">Partager</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type FacebookPreviewProps = {
  text: string;
  hashtags: string[];
};

export function FacebookPreview({ text, hashtags }: FacebookPreviewProps) {
  const fullContent = `${text}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <div>
              <p className="font-bold text-neutral-900">Facebook</p>
              <p className="text-xs text-neutral-500">Publication sur votre page</p>
            </div>
          </div>
          <CopyButton content={fullContent} />
        </div>
      </div>

      {/* Facebook Post */}
      <div className="p-4 bg-white">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">Votre Page</p>
            <p className="text-xs text-neutral-500">À l&apos;instant · 🌐</p>
          </div>
        </div>

        <p className="text-neutral-900 whitespace-pre-wrap mb-3">{text}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {hashtags.map((tag, i) => (
            <span key={i} className="text-[#1877F2] hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* Facebook Engagement */}
        <div className="py-2 border-y border-neutral-200 text-xs text-neutral-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <div className="h-4 w-4 rounded-full bg-[#1877F2] flex items-center justify-center border border-white">
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
                <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center border border-white">
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <span>2 commentaires · 3 partages</span>
          </div>
        </div>

        {/* Facebook Actions */}
        <div className="flex items-center justify-around mt-2">
          <button className="flex items-center gap-2 py-1.5 px-4 text-neutral-600 hover:bg-neutral-50 rounded transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="text-sm font-medium">J&apos;aime</span>
          </button>
          <button className="flex items-center gap-2 py-1.5 px-4 text-neutral-600 hover:bg-neutral-50 rounded transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Commenter</span>
          </button>
          <button className="flex items-center gap-2 py-1.5 px-4 text-neutral-600 hover:bg-neutral-50 rounded transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium">Partager</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type TikTokPreviewProps = {
  text: string;
  hashtags: string[];
  hooks?: string[];
};

export function TikTokPreview({ text, hashtags, hooks }: TikTokPreviewProps) {
  const caption = `${text}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;

  return (
    <div className="rounded-xl border border-neutral-200 bg-black overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-700 bg-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <div>
              <p className="font-bold text-white">TikTok</p>
              <p className="text-xs text-neutral-400">Vidéo courte</p>
            </div>
          </div>
          <CopyButton content={caption} />
        </div>
      </div>

      {/* TikTok Post */}
      <div className="bg-black">
        {/* Video Area */}
        <div className="relative aspect-[9/16] max-h-[500px] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <svg className="mx-auto h-20 w-20 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <p className="text-sm text-neutral-400">Votre vidéo TikTok ici</p>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-3 bottom-20 flex flex-col gap-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-1">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-xs text-white">123K</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-neutral-700 flex items-center justify-center mb-1">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xs text-white">45.2K</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-neutral-700 flex items-center justify-center mb-1">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs text-white">8.9K</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-neutral-700 flex items-center justify-center mb-1">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span className="text-xs text-white">2.1K</span>
            </div>
          </div>

          {/* Bottom User Info */}
          <div className="absolute bottom-4 left-3 right-20">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600" />
              <p className="font-semibold text-white text-sm">@votre_compte</p>
            </div>
            <p className="text-white text-sm whitespace-pre-wrap mb-2">{text}</p>
            <p className="text-white text-sm">
              {hashtags.map((tag, i) => (
                <span key={i} className="mr-1">#{tag}</span>
              ))}
            </p>
          </div>
        </div>

        {/* Hooks Section */}
        {hooks && hooks.length > 0 && (
          <div className="p-4 bg-neutral-900 border-t border-neutral-700">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-400 mb-2">Accroches suggérées:</p>
                <div className="space-y-2">
                  {hooks.map((hook, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-pink-500 text-xs font-bold">{i + 1}.</span>
                      <p className="text-sm text-white flex-1">{hook}</p>
                    </div>
                  ))}
                </div>
              </div>
              <CopyButton content={hooks.join('\n\n')} label="Copier hooks" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type InstagramPreviewProps = {
  text: string;
  hashtags: string[];
  firstComment?: string;
};

export function InstagramPreview({ text, hashtags, firstComment }: InstagramPreviewProps) {
  const caption = `${text}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
            </svg>
            <div>
              <p className="font-bold text-neutral-900">Instagram</p>
              <p className="text-xs text-neutral-500">Post sur votre profil</p>
            </div>
          </div>
          <CopyButton content={caption} label="Copier la légende" />
        </div>
      </div>

      {/* Instagram Post */}
      <div className="bg-white">
        {/* Post Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 p-0.5">
              <div className="h-full w-full rounded-full bg-white" />
            </div>
            <p className="font-semibold text-sm">votre_compte</p>
          </div>
          <svg className="h-6 w-6 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/>
          </svg>
        </div>

        {/* Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
          <p className="text-neutral-400 text-sm">Votre image ici</p>
        </div>

        {/* Post Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <svg className="h-7 w-7 text-neutral-900 cursor-pointer hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <svg className="h-7 w-7 text-neutral-900 cursor-pointer hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <svg className="h-7 w-7 text-neutral-900 cursor-pointer hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <svg className="h-6 w-6 text-neutral-900 cursor-pointer hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>

          {/* Caption */}
          <div className="text-sm">
            <p className="mb-2">
              <span className="font-semibold text-neutral-900 mr-2">votre_compte</span>
              <span className="whitespace-pre-wrap text-neutral-900">{text}</span>
            </p>
            <p className="text-[#E4405F] mb-2">
              {hashtags.map((tag, i) => (
                <span key={i} className="mr-1">#{tag}</span>
              ))}
            </p>
          </div>
        </div>

        {/* First Comment */}
        {firstComment && (
          <div className="px-3 pb-3 border-t border-neutral-100 pt-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-neutral-600 flex-1">
                <span className="font-semibold text-neutral-900 mr-2">Premier commentaire:</span>
                {firstComment}
              </p>
              <CopyButton content={firstComment} label="Copier" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
