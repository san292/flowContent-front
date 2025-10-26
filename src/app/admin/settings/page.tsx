"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type BlogSettings = {
  siteName: string;
  siteDescription: string;
  defaultAuthor: string;
  domain: string;
  autoPublish: boolean;
  publicationFrequency: string;
  defaultCategory: string;
  aiModel: string;
  maxArticlesPerDay: number;
};

type SocialSettings = {
  twitterEnabled: boolean;
  twitterApiKey: string;
  facebookEnabled: boolean;
  facebookApiKey: string;
  linkedinEnabled: boolean;
  linkedinApiKey: string;
  instagramEnabled: boolean;
  instagramApiKey: string;
};

const SettingsPage=()=> {
  const [blogSettings, setBlogSettings] = useState<BlogSettings>({
    siteName: "Blog IA",
    siteDescription: "Blog alimenté par l'intelligence artificielle",
    defaultAuthor: "IA Assistant",
    domain: "localhost:3000",
    autoPublish: false,
    publicationFrequency: "daily",
    defaultCategory: "Technologie",
    aiModel: "gpt-4",
    maxArticlesPerDay: 3,
  });

  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    twitterEnabled: false,
    twitterApiKey: "",
    facebookEnabled: false,
    facebookApiKey: "",
    linkedinEnabled: false,
    linkedinApiKey: "",
    instagramEnabled: false,
    instagramApiKey: "",
  });

  const [activeTab, setActiveTab] = useState<"blog" | "social" | "ai">("blog");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Charger les paramètres depuis localStorage pour la démo
    const savedBlogSettings = localStorage.getItem("blogSettings");
    const savedSocialSettings = localStorage.getItem("socialSettings");
    
    if (savedBlogSettings) {
      setBlogSettings(JSON.parse(savedBlogSettings));
    }
    if (savedSocialSettings) {
      setSocialSettings(JSON.parse(savedSocialSettings));
    }
  }, []);

  const saveBlogSettings = () => {
    localStorage.setItem("blogSettings", JSON.stringify(blogSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const saveSocialSettings = () => {
    localStorage.setItem("socialSettings", JSON.stringify(socialSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async (platform: string) => {
    // Simulation d'un test de connexion
    alert(`Test de connexion ${platform} - Fonctionnalité à implémenter avec votre backend`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
              <p className="mt-1 text-sm text-gray-500">
                Configuration de votre blog automatisé
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Message de sauvegarde */}
        {saved && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm font-medium text-green-800">
                Paramètres sauvegardés avec succès !
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { key: "blog", label: "Blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
                { key: "social", label: "Réseaux sociaux", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                { key: "ai", label: "IA & Génération", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-white shadow">
              {/* Onglet Blog */}
              {activeTab === "blog" && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration du blog</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          value={blogSettings.siteName}
                          onChange={(e) => setBlogSettings({ ...blogSettings, siteName: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Domaine
                        </label>
                        <input
                          type="text"
                          value={blogSettings.domain}
                          onChange={(e) => setBlogSettings({ ...blogSettings, domain: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description du site
                      </label>
                      <textarea
                        value={blogSettings.siteDescription}
                        onChange={(e) => setBlogSettings({ ...blogSettings, siteDescription: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Auteur par défaut
                        </label>
                        <input
                          type="text"
                          value={blogSettings.defaultAuthor}
                          onChange={(e) => setBlogSettings({ ...blogSettings, defaultAuthor: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Catégorie par défaut
                        </label>
                        <select
                          value={blogSettings.defaultCategory}
                          onChange={(e) => setBlogSettings({ ...blogSettings, defaultCategory: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        >
													<option value="Technologie">Technologie</option>
													<option value="Business">Business</option>
													<option value="Santé">Santé</option>
													<option value="Environnement">Environnement</option>
													<option value="Lifestyle">Lifestyle</option>
													<option value="Éducation">Éducation</option>
													<option value="Finance">Finance</option>
													<option value="Science">Science</option>
													<option value="Voyage">Voyage</option>
													<option value="Sport">Sport</option>
                          <option value="Musique">Musique</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fréquence de publication
                        </label>
                        <select
                          value={blogSettings.publicationFrequency}
                          onChange={(e) => setBlogSettings({ ...blogSettings, publicationFrequency: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        >
                          <option value="hourly">Toutes les heures</option>
                          <option value="daily">Quotidien</option>
                          <option value="weekly">Hebdomadaire</option>
                          <option value="monthly">Mensuel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Articles max par jour
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={blogSettings.maxArticlesPerDay}
                          onChange={(e) => setBlogSettings({ ...blogSettings, maxArticlesPerDay: parseInt(e.target.value) })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={blogSettings.autoPublish}
                        onChange={(e) => setBlogSettings({ ...blogSettings, autoPublish: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Publication automatique des articles générés
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveBlogSettings}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Réseaux sociaux */}
              {activeTab === "social" && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration des réseaux sociaux</h2>
                  
                  <div className="space-y-8">
                    {[
                      { key: "twitter", label: "Twitter", color: "blue" },
                      { key: "facebook", label: "Facebook", color: "blue" },
                      { key: "linkedin", label: "LinkedIn", color: "blue" },
                      { key: "instagram", label: "Instagram", color: "pink" },
                    ].map(({ key, label, color }) => (
                      <div key={key} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={socialSettings[`${key}Enabled` as keyof SocialSettings] as boolean}
                              onChange={(e) => setSocialSettings({ 
                                ...socialSettings, 
                                [`${key}Enabled`]: e.target.checked 
                              })}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label className="ml-3 text-lg font-medium text-gray-900">
                              {label}
                            </label>
                          </div>
                          
                          {socialSettings[`${key}Enabled` as keyof SocialSettings] && (
                            <button
                              onClick={() => testConnection(label)}
                              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                            >
                              Tester
                            </button>
                          )}
                        </div>

                        {socialSettings[`${key}Enabled` as keyof SocialSettings] && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Clé API {label}
                              </label>
                              <input
                                type="password"
                                value={socialSettings[`${key}ApiKey` as keyof SocialSettings] as string}
                                onChange={(e) => setSocialSettings({ 
                                  ...socialSettings, 
                                  [`${key}ApiKey`]: e.target.value 
                                })}
                                placeholder="Entrez votre clé API..."
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                              />
                            </div>
                            
                            <div className="rounded-md bg-gray-50 p-3">
                              <p className="text-xs text-gray-600">
                                Pour obtenir votre clé API {label}, rendez-vous sur le portail développeur de {label} 
                                et créez une nouvelle application.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-end">
                      <button
                        onClick={saveSocialSettings}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet IA */}
              {activeTab === "ai" && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration de l'IA</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Modèle d'IA
                      </label>
                      <select
                        value={blogSettings.aiModel}
                        onChange={(e) => setBlogSettings({ ...blogSettings, aiModel: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3">Claude 3</option>
                        <option value="gemini">Gemini</option>
                      </select>
                    </div>

                    <div className="rounded-md bg-blue-50 p-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">
                        Intégration avec votre backend
                      </h3>
                      <p className="text-sm text-blue-700">
                        Cette section sera connectée à votre backend Node.js qui gère la génération d'articles. 
                        Vos paramètres d'IA seront transmis à votre système de génération automatique.
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-base font-medium text-gray-900 mb-4">
                        Prompt par défaut
                      </h3>
                      <textarea
                        placeholder="Rédigez un article informatif et engageant sur le sujet suivant..."
                        rows={6}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Ce prompt sera utilisé par défaut pour la génération d'articles
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveBlogSettings}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default  SettingsPage