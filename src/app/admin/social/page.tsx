"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";
import type { Article, SocialGenerateAllResponse, Language } from "@/types/ApiTypes";
import { TwitterPreview, LinkedInPreview, FacebookPreview, InstagramPreview, TikTokPreview } from "@/components/SocialPreviews";

const LANGUAGES = [
  { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
  { code: 'darija' as Language, label: 'Darija (Marocain)', flag: '🇲🇦' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
  { code: 'ar' as Language, label: 'العربية', flag: '🇦🇪' },
  { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as Language, label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt' as Language, label: 'Português', flag: '🇵🇹' },
];

function SocialMediaPageContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [language, setLanguage] = useState<Language>('fr');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<SocialGenerateAllResponse | null>(null);

  // Load published articles on mount and pre-select if articleId in URL
  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getArticles({
        limit: 100,
      });
      // Filter only published articles
      const published = response.articles.filter(a => a.status === "published");
      setArticles(published);

      // Pre-select article if articleId in URL
      const articleId = searchParams.get("articleId");
      if (articleId) {
        const preSelected = published.find(a => a.id === articleId);
        if (preSelected) {
          setSelectedArticle(preSelected);
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement des articles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedArticle) {
      setError("Veuillez sélectionner un article");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSaveSuccess(false);
      setGeneratedContent(null);

      const result = await apiService.generateSocialContentAll({
        networks: ["twitter", "linkedin", "facebook", "instagram", "tiktok"],
        language: language,
        article: {
          id: selectedArticle.id,
          title: selectedArticle.title,
          content: selectedArticle.content,
          description: selectedArticle.description,
          tags: selectedArticle.tags,
        },
      });

      setGeneratedContent(result);
    } catch (err) {
      setError("Erreur lors de la génération du contenu");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent || !generatedContent.success) {
      setError("Aucun contenu à sauvegarder");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSaveSuccess(false);

      const networks: Array<{ network: string; data: any }> = [];

      if (generatedContent.data.twitter) {
        networks.push({ network: 'twitter', data: generatedContent.data.twitter });
      }
      if (generatedContent.data.linkedin) {
        networks.push({ network: 'linkedin', data: generatedContent.data.linkedin });
      }
      if (generatedContent.data.facebook) {
        networks.push({ network: 'facebook', data: generatedContent.data.facebook });
      }
      if (generatedContent.data.instagram) {
        networks.push({ network: 'instagram', data: generatedContent.data.instagram });
      }
      if (generatedContent.data.tiktok) {
        networks.push({ network: 'tiktok', data: generatedContent.data.tiktok });
      }

      // Sauvegarder chaque post comme brouillon programmé pour "plus tard"
      const savePromises = networks.map(async ({ network, data }) => {
        // Programmer pour demain (comme brouillon)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const payload = {
          platform: network as any,
          content: data,  // Envoyer l'objet complet (text, hashtags, cardStyle, etc.)
          scheduledFor: tomorrow.toISOString(),
        };

        console.log(`📤 Saving ${network}:`, JSON.stringify(payload, null, 2));

        try {
          const result = await apiService.schedulePost(payload);
          console.log(`✅ ${network} saved successfully:`, result);
          return { network, success: true };
        } catch (err: any) {
          console.error(`❌ Failed to save ${network}:`, err);
          console.error(`Error message:`, err.message);
          return { network, success: false, error: err.message || err };
        }
      });

      const results = await Promise.all(savePromises);
      const succeeded = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length === 0) {
        // All succeeded
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else if (succeeded.length > 0) {
        // Partial success
        const failedNetworks = failed.map(f => f.network).join(', ');
        const errorMessages = failed.map(f => f.error).filter(Boolean);
        const firstError = errorMessages[0] || 'Erreur inconnue';
        setError(`Sauvegarde partielle : ${succeeded.length}/${networks.length} réussis. Échec : ${failedNetworks}. Erreur: ${firstError}`);
      } else {
        // All failed
        const errorMessages = failed.map(f => f.error).filter(Boolean);
        const firstError = errorMessages[0] || 'Erreur inconnue';
        setError(`Erreur lors de la sauvegarde de tous les posts. ${firstError}. Vérifiez la console pour plus de détails.`);
      }
    } catch (err) {
      setError("Erreur lors de la sauvegarde. Le backend n'est peut-être pas encore configuré pour cette fonctionnalité.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Réseaux Sociaux
            </h1>
            <p className="mt-2 text-neutral-600">
              Générez du contenu optimisé pour tous vos réseaux sociaux
            </p>
          </div>
          <Link
            href="/admin/social/history"
            className="flex items-center gap-2 rounded-lg border-2 border-neutral-900 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historique des posts
          </Link>
        </div>
      </header>

      {/* Language Selector */}
      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          🌍 Langue de publication
        </h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 font-medium focus:border-neutral-500 focus:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-neutral-500">
          Le contenu sera généré dans la langue sélectionnée pour tous les réseaux
        </p>
      </div>

      {/* Article Selection */}
      <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Sélectionner un article
        </h2>

        {loading ? (
          <p className="text-neutral-500">Chargement des articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-neutral-500">Aucun article publié disponible</p>
        ) : (
          <div className="space-y-4">
            <select
              className="w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 font-medium focus:border-neutral-500 focus:outline-none"
              value={selectedArticle?.id || ""}
              onChange={(e) => {
                const article = articles.find(a => a.id === e.target.value);
                setSelectedArticle(article || null);
                setGeneratedContent(null); // Reset on article change
              }}
            >
              <option value="">-- Choisir un article --</option>
              {articles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>

            {selectedArticle && (
              <div className="rounded-md bg-neutral-50 p-4">
                <h3 className="font-semibold text-neutral-900">
                  {selectedArticle.title}
                </h3>
                {selectedArticle.description && (
                  <p className="mt-2 text-sm text-neutral-600">
                    {selectedArticle.description}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  {selectedArticle.category && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {selectedArticle.category}
                    </span>
                  )}
                  {selectedArticle.domain && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {selectedArticle.domain}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!selectedArticle || generating}
              className="w-full rounded-md bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Génération en cours...
                </span>
              ) : (
                "Générer le contenu pour tous les réseaux"
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Generated Content Preview */}
      {generatedContent && generatedContent.success && (
        <div className="space-y-6">
          {/* Header with Save Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">
              Contenu généré - Prévisualisations
            </h2>
            <button
              onClick={handleSave}
              disabled={saving || saveSuccess}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors ${
                saveSuccess
                  ? "bg-green-600 cursor-not-allowed"
                  : saving
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-neutral-900 hover:bg-neutral-800"
              }`}
            >
              {saveSuccess ? (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sauvegardé !
                </>
              ) : saving ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Sauvegarder tous les posts
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 font-medium">
                  Posts sauvegardés avec succès ! Retrouvez-les dans l'historique.
                </p>
                <Link
                  href="/admin/social/history"
                  className="ml-auto text-sm font-semibold text-green-700 hover:text-green-800 underline"
                >
                  Voir l'historique →
                </Link>
              </div>
            </div>
          )}

          {/* Twitter */}
          {generatedContent.data.twitter && (
            <TwitterPreview
              text={generatedContent.data.twitter.text}
              hashtags={generatedContent.data.twitter.hashtags}
              cardStyle={generatedContent.data.twitter.cardStyle}
            />
          )}

          {/* LinkedIn */}
          {generatedContent.data.linkedin && (
            <LinkedInPreview
              text={generatedContent.data.linkedin.text}
              hashtags={generatedContent.data.linkedin.hashtags}
              format={generatedContent.data.linkedin.format}
            />
          )}

          {/* Facebook */}
          {generatedContent.data.facebook && (
            <FacebookPreview
              text={generatedContent.data.facebook.text}
              hashtags={generatedContent.data.facebook.hashtags}
            />
          )}

          {/* Instagram */}
          {generatedContent.data.instagram && (
            <InstagramPreview
              text={generatedContent.data.instagram.text}
              hashtags={generatedContent.data.instagram.hashtags}
              firstComment={generatedContent.data.instagram.firstComment}
            />
          )}

          {/* TikTok */}
          {generatedContent.data.tiktok && (
            <TikTokPreview
              text={generatedContent.data.tiktok.text}
              hashtags={generatedContent.data.tiktok.hashtags}
              hooks={generatedContent.data.tiktok.hooks}
            />
          )}
        </div>
      )}
    </main>
  );
}

export default function SocialMediaPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-900 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-neutral-600">Chargement...</p>
        </div>
      </div>
    }>
      <SocialMediaPageContent />
    </Suspense>
  );
}
