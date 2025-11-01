"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AnalyticsData = {
  totalArticles: number;
  publishedThisWeek: number;
  publishedThisMonth: number;
  topCategories: { category: string; count: number }[];
  topTopics: { topic: string; count: number }[];
  recentActivity: { date: string; published: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const { data: articles, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!articles) {
        setAnalytics({
          totalArticles: 0,
          publishedThisWeek: 0,
          publishedThisMonth: 0,
          topCategories: [],
          topTopics: [],
          recentActivity: [],
          statusDistribution: [],
        });
        setLoading(false);
        return;
      }

      // Calculs des métriques
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const publishedThisWeek = articles.filter(
        (a) => a.status === "published" && new Date(a.created_at) >= oneWeekAgo
      ).length;

      const publishedThisMonth = articles.filter(
        (a) => a.status === "published" && new Date(a.created_at) >= oneMonthAgo
      ).length;

      // Top catégories
      const categoryCount: Record<string, number> = articles.reduce(
        (acc, article) => {
          const cat = article.category || "Non catégorisé";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top sujets
      const topicCount: Record<string, number> = articles.reduce(
        (acc, article) => {
          const topic = article.original_topic || "Sans sujet";
          acc[topic] = (acc[topic] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const topTopics = Object.entries(topicCount)
        .map(([topic, count]) => ({ topic, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Distribution des statuts
      const statusCount: Record<string, number> = articles.reduce(
        (acc, article) => {
          acc[article.status] = (acc[article.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const statusDistribution = Object.keys(statusCount).map((status) => {
        const count = statusCount[status];
        return {
          status,
          count,
          percentage: Math.round((count / articles.length) * 100),
        };
      });

      // Activité récente (derniers 7 jours)
      const recentActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split("T")[0];
        const published = articles.filter(
          (a) =>
            a.status === "published" && a.created_at.split("T")[0] === dateStr
        ).length;
        recentActivity.push({
          date: dateStr,
          published,
        });
      }

      setAnalytics({
        totalArticles: articles.length,
        publishedThisWeek,
        publishedThisMonth,
        topCategories,
        topTopics,
        recentActivity,
        statusDistribution,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      published: "bg-green-500",
      draft: "bg-yellow-500",
      pending: "bg-blue-500",
      error: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getMaxActivity = () => {
    if (!analytics?.recentActivity.length) return 1;
    return Math.max(...analytics.recentActivity.map((a) => a.published)) || 1;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Erreur lors du chargement des données</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Statistiques et performance de votre blog
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) =>
                  setDateRange(e.target.value as typeof dateRange)
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="all">Toute la période</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Métriques principales */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total articles
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.totalArticles}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Cette semaine
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.publishedThisWeek}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Ce mois</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.publishedThisMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Taux publication
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.statusDistribution.find(
                      (s) => s.status === "published"
                    )?.percentage || 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Graphique d'activité */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activité des 7 derniers jours
            </h3>
            <div className="space-y-3">
              {analytics.recentActivity.map((day, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-xs text-gray-500">
                    {formatDate(day.date)}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${(day.published / getMaxActivity()) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-right text-sm font-medium text-gray-900">
                    {day.published}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution des statuts */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par statut
            </h3>
            <div className="space-y-4">
              {analytics.statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        item.status
                      )} mr-3`}
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{item.count}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Top catégories */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top catégories
            </h3>
            <div className="space-y-3">
              {analytics.topCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.category}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
              {analytics.topCategories.length === 0 && (
                <p className="text-sm text-gray-500">
                  Aucune catégorie trouvée
                </p>
              )}
            </div>
          </div>

          {/* Top sujets */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sujets les plus traités
            </h3>
            <div className="space-y-3">
              {analytics.topTopics.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.topic}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
              {analytics.topTopics.length === 0 && (
                <p className="text-sm text-gray-500">Aucun sujet trouvé</p>
              )}
            </div>
          </div>
        </div>

        {/* Note sur les métriques futures */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Métriques avancées à venir
          </h3>
          <p className="text-sm text-blue-700">
            Une fois votre blog connecté aux réseaux sociaux et aux outils
            d`&apos;`analytics, vous pourrez voir ici des métriques comme les vues,
            partages, engagement, trafic généré, et ROI de vos publications
            automatiques.
          </p>
        </div>
      </div>
    </main>
  );
}
