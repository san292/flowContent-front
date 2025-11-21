"use client";

import { useState } from "react";
import SocialMediaKitModal from "./SocialMediaKitModal";

interface Article {
  id: string;
  title: string;
  content: string;
  description?: string | null;
  tags?: string[] | null;
  slug?: string;
}

interface SocialShareSectionProps {
  article: Article;
}

export default function SocialShareSection({ article }: SocialShareSectionProps) {
  const [showSocialKitModal, setShowSocialKitModal] = useState(false);

  return (
    <>
      <div className="mt-12 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setShowSocialKitModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          📱 Kit Social Media
        </button>

        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-200 transition-colors"
        >
          Copier le lien
        </button>
      </div>

      <SocialMediaKitModal
        article={article}
        isOpen={showSocialKitModal}
        onClose={() => setShowSocialKitModal(false)}
      />
    </>
  );
}
