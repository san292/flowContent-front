"use client";

import { useState, useEffect, useMemo } from "react";
import { apiService } from "@/lib/api";
import type { SocialPost, SocialNetwork } from "@/types/ApiTypes";
import Link from "next/link";

type FilterNetwork = SocialNetwork | "all";

export default function SocialHistoryPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterNetwork>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Chargement de l'historique des posts...");
      const response = await apiService.getSocialPosts({ limit: 1000 });
      console.log("📥 Réponse reçue:", response);

      if (response.success && response.data && response.data.posts && Array.isArray(response.data.posts)) {
        setPosts(response.data.posts);
        console.log(`✅ ${response.data.posts.length} posts chargés`);
      } else {
        console.warn("⚠️ Réponse sans posts:", response);
        setPosts([]);
      }
    } catch (err: any) {
      console.error("❌ Erreur lors du chargement des posts:", err);
      const errorMessage = err.message || "Erreur inconnue";
      setError(`Impossible de charger l'historique: ${errorMessage}. Le backend doit implémenter l'endpoint GET /api/social-media.`);
      setPosts([]); // Set empty array to avoid errors
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    // S'assurer que posts est un tableau
    if (!Array.isArray(posts)) {
      return [];
    }

    let result = [...posts];

    // Filtre par réseau
    if (filter !== "all") {
      result = result.filter((post) => post.network === filter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter((post) => {
        const contentText = typeof post.content === 'string' ? post.content : post.content.text;
        const hashtags = typeof post.content === 'string' ? [] : (post.content.hashtags || []);
        return contentText.toLowerCase().includes(query) ||
          hashtags.some((tag) => tag.toLowerCase().includes(query));
      });
    }

    // Tri par date (plus récent en premier)
    return result.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [posts, filter, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

    try {
      setDeletingId(id);
      // Note: Utiliser l'endpoint approprié selon votre backend
      // await apiService.deleteSocialPost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du post");
    } finally {
      setDeletingId(null);
    }
  };

  const getNetworkIcon = (network: SocialNetwork) => {
    const icons = {
      twitter: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      linkedin: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      facebook: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </svg>
      ),
      tiktok: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
    };
    return icons[network];
  };

  const getNetworkColor = (network: SocialNetwork) => {
    const colors = {
      twitter: "text-[#1DA1F2] bg-[#1DA1F2]/10",
      linkedin: "text-[#0A66C2] bg-[#0A66C2]/10",
      facebook: "text-[#1877F2] bg-[#1877F2]/10",
      instagram: "text-[#E4405F] bg-[#E4405F]/10",
      tiktok: "text-black bg-neutral-100",
    };
    return colors[network];
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date inconnue";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Date invalide";
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  const networkCounts = useMemo(() => {
    const counts = {
      all: 0,
      twitter: 0,
      linkedin: 0,
      facebook: 0,
      instagram: 0,
      tiktok: 0,
    };

    if (!Array.isArray(posts)) {
      return counts;
    }

    counts.all = posts.length;
    posts.forEach((post) => {
      if (post.network && counts[post.network] !== undefined) {
        counts[post.network]++;
      }
    });
    return counts;
  }, [posts]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-900 border-t-transparent"></div>
          <p className="mt-2 text-neutral-600">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/social" className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Historique des publications</h1>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Fonctionnalité en développement</h3>
                <p className="text-yellow-800 mb-4">{error}</p>
                <p className="text-sm text-yellow-700">
                  Pour l'instant, vous pouvez copier manuellement le contenu généré avant de quitter la page.
                </p>
                <div className="mt-4">
                  <Link
                    href="/admin/social"
                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour à la génération
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/social" className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Historique des publications
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredPosts.length} post(s) affiché(s)
                </p>
              </div>
            </div>
            <Link
              href="/admin/social"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Générer nouveau contenu
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { key: "all", label: "Total", icon: "📊" },
            { key: "twitter", label: "Twitter", icon: "🐦" },
            { key: "linkedin", label: "LinkedIn", icon: "💼" },
            { key: "facebook", label: "Facebook", icon: "👥" },
            { key: "instagram", label: "Instagram", icon: "📸" },
            { key: "tiktok", label: "TikTok", icon: "🎵" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterNetwork)}
              className={`rounded-lg border p-4 text-left transition-all ${
                filter === key
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className={`text-2xl font-bold ${filter === key ? "text-white" : "text-neutral-900"}`}>
                {networkCounts[key as keyof typeof networkCounts]}
              </div>
              <div className={`text-sm ${filter === key ? "text-neutral-200" : "text-neutral-600"}`}>
                {label}
              </div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans les posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-3 text-neutral-900 font-medium focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Posts List */}
        <div className="rounded-lg bg-white shadow">
          {filteredPosts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${getNetworkColor(post.network)}`}>
                          {getNetworkIcon(post.network)}
                          <span className="text-sm font-semibold capitalize">{post.network}</span>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(post.status)}`}>
                          {post.status}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {formatDate(post.created_at)}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-neutral-900 mb-2 line-clamp-3">
                        {post.content}
                      </p>

                      {/* Hashtags */}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.hashtags.slice(0, 5).map((tag, i) => (
                            <span key={i} className="text-sm text-blue-600">
                              #{tag}
                            </span>
                          ))}
                          {post.hashtags.length > 5 && (
                            <span className="text-sm text-neutral-500">
                              +{post.hashtags.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const text = post.hashtags && post.hashtags.length > 0
                            ? `${post.content}\n\n${post.hashtags.map(t => `#${t}`).join(' ')}`
                            : post.content;
                          navigator.clipboard.writeText(text);
                        }}
                        className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
                        title="Copier"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="text-red-400 hover:text-red-600 disabled:opacity-50"
                        title="Supprimer"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun post trouvé
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter !== "all"
                  ? "Modifiez vos filtres pour voir plus de posts."
                  : "Générez votre premier contenu pour les réseaux sociaux."}
              </p>
              {!searchTerm && filter === "all" && (
                <div className="mt-6">
                  <Link
                    href="/admin/social"
                    className="inline-flex items-center rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
                  >
                    Générer du contenu
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
