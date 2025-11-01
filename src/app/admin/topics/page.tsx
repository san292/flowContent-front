"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

type TopicSummary = {
  original_topic: string;
  category: string;
  article_count: number;
  latest_created: string;
  statuses: { status: string; count: number }[];
  tags: string[];
};

type NewTopic = {
  title: string;
  topic: string;
  original_topic: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
};

type JobStatus= "pending" | "generating" | "completed" | "error";

type GenerationJob = {
  articleId: string;
  status: JobStatus
  progress?: number;
};

export default function TopicsManagement() {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [generationJobs, setGenerationJobs] = useState<
    Record<string, GenerationJob>
  >({});
  const [newTopic, setNewTopic] = useState<NewTopic>({
    title: "",
    topic: "",
    original_topic: "",
    description: "",
    category: "",
    tags: [],
    author: "IA Assistant",
  });
  const [tagsInput, setTagsInput] = useState("");

  const { showToast, ToastBanner } = useToast();

  useEffect(() => {
    fetchTopicsSummary();
  }, []);

  // Polling pour les jobs de génération en cours
  useEffect(() => {
    const activeJobs = Object.keys(generationJobs).filter(
      (id) => generationJobs[id].status === "generating"
    );

    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      for (const jobId of activeJobs) {
        try {
          const status = await apiService.getJobStatus(jobId);
          setGenerationJobs((prev) => ({
            ...prev,
            [jobId]: {
              ...prev[jobId],
              status: status.status as JobStatus,
              progress: status.progress,
            },
          }));

          if (status.status === "completed" || status.status === "error") {
            showToast("success", "Article généré avec succès 🎉");
            // Rafraîchir la liste des articles
            fetchTopicsSummary();
          }
        } catch (error) {
          showToast("error", "La génération a échoué.");

          console.error(
            `Erreur lors de la vérification du job ${jobId}:`,
            error
          );
        }
      }
    }, 3000); // Check toutes les 3 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generationJobs]);

  const fetchTopicsSummary = async () => {
    try {
      const { data: articles, error } = await supabase
        .from("articles")
        .select("original_topic, category, status, created_at, tags")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Grouper par original_topic
      const topicsMap = new Map<string, TopicSummary>();

      articles?.forEach((article) => {
        const key = article.original_topic || "Sans sujet";

        if (!topicsMap.has(key)) {
          topicsMap.set(key, {
            original_topic: key,
            category: article.category || "Non catégorisé",
            article_count: 0,
            latest_created: article.created_at,
            statuses: [],
            tags: [],
          });
        }

        const topic = topicsMap.get(key)!;
        topic.article_count++;

        // Mettre à jour la date la plus récente
        if (new Date(article.created_at) > new Date(topic.latest_created)) {
          topic.latest_created = article.created_at;
          topic.category = article.category || topic.category;
        }

        // Compter les statuts
        const statusIndex = topic.statuses.findIndex(
          (s) => s.status === article.status
        );
        if (statusIndex >= 0) {
          topic.statuses[statusIndex].count++;
        } else {
          topic.statuses.push({ status: article.status, count: 1 });
        }

        // Collecter les tags uniques
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag) => {
            if (!topic.tags.includes(tag)) {
              topic.tags.push(tag);
            }
          });
        }
      });

      setTopics(
        Array.from(topicsMap.values()).sort(
          (a, b) =>
            new Date(b.latest_created).getTime() -
            new Date(a.latest_created).getTime()
        )
      );
    } catch (error) {
      console.error("Erreur lors du chargement des sujets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tagsArray = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // UNIQUEMENT appel API backend - plus de Supabase direct
      const result = await apiService.generateArticleFromDashboard({
        title: newTopic.title,
        topic: newTopic.topic,
        original_topic: newTopic.original_topic,
        description: newTopic.description,
        category: newTopic.category,
        domain: "dashboard", // ou votre domaine
        tags: tagsArray,
        author: newTopic.author,
      });

      if (result.success) {
        showToast("success", result.message || "Brouillon créé.");
        // Article créé avec succès par le backend
        console.log("Article result.articleId créé:", result.articleId);

        await apiService.processArticleFromDashboard(result.articleId);

        // Reset formulaire
        setNewTopic({
          title: "",
          topic: "",
          original_topic: "",
          description: "",
          category: "",
          tags: [],
          author: "IA Assistant",
        });
        setTagsInput("");
        setShowNewForm(false);

        // Rafraîchir la liste
        fetchTopicsSummary();
      } else {
        console.error("Erreur création:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du sujet:", error);
    }
  };

  const handleProcessTopic = async (originalTopic: string) => {
    try {
      // Trouver l'article via Supabase (pour récupérer l'ID)
      const { data: draftArticles, error } = await supabase
        .from("articles")
        .select("id")
        .eq("original_topic", originalTopic)
        .eq("status", "draft")
        .limit(1);

      if (error) throw error;

      if (draftArticles && draftArticles.length > 0) {
        const articleId = draftArticles[0].id;

        console.log("🚀 Lancement génération IA pour article:", articleId);

        // Appel API backend pour génération IA
        const response = await apiService.processArticleFromDashboard(
          articleId
        );

        console.log("📊 Réponse backend:", response);

        if (response.success) {
          showToast("success", response.message || "Génération IA démarrée…");

          console.log("Génération IA démarrée:", response.jobId);
          fetchTopicsSummary();
        } else {
          showToast("success", response.error || "Erreur génération.");

          console.error(
            "Erreur génération,Aucun article draft trouvé pour ce sujet",
            response.error
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800",
      error: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateStr));
  };

  const getGenerationStatus = () => {
    // Trouver un job de génération en cours pour ce sujet
    const job = Object.values(generationJobs).find((job) => {
      // Ici vous devriez avoir une logique pour lier les jobs aux sujets
      // Pour maintenant, on assume qu'il n'y a qu'un job par sujet
      return job.status === "generating";
    });
    return job;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des sujets...</p>
        </div>
      </div>
    );
  }

  <ToastBanner />;

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
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des sujets
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Créez de nouveaux sujets pour la génération d&lsquo;articles IA
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewForm(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Nouveau sujet
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Jobs de génération en cours */}
        {Object.keys(generationJobs).length > 0 && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Génération en cours
            </h3>
            <div className="space-y-2">
              {Object.values(generationJobs).map((job) => (
                <div
                  key={job.articleId}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-1">
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${job.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-blue-700 font-medium">
                    {job.status === "generating"
                      ? "Génération..."
                      : job.status === "completed"
                      ? "Terminé"
                      : job.status === "error"
                      ? "Erreur"
                      : job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire nouveau sujet */}
        {showNewForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Nouveau sujet pour l&lsquo;IA
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre de l&lsquo;article
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopic.title}
                    onChange={(e) =>
                      setNewTopic({ ...newTopic, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-400"
                    placeholder="Ex: L'avenir de l'intelligence artificielle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    required
                    value={newTopic.category}
                    onChange={(e) =>
                      setNewTopic({ ...newTopic, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-400"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Sport">Sport</option>
                    <option value="Technologie">Technologie</option>
                    <option value="Business">Business</option>
                    <option value="Santé">Santé</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Finance">Finance</option>
                    <option value="Science">Science</option>
                    <option value="Voyage">Voyage</option>
                    <option value="Musique">Musique</option>
                    <option value="Divertissement">Divertissement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sujet spécifique
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopic.topic}
                    onChange={(e) =>
                      setNewTopic({ ...newTopic, topic: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-300"
                    placeholder="Ex: IA générative"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sujet original (thème global)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopic.original_topic}
                    onChange={(e) =>
                      setNewTopic({
                        ...newTopic,
                        original_topic: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Ex: Intelligence Artificielle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description pour l&lsquo;IA
                </label>
                <textarea
                  required
                  value={newTopic.description}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-400"
                  placeholder="Décrivez ce que l'IA doit couvrir dans l'article..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-300"
                    placeholder="IA, technologie, innovation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Auteur
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopic.author}
                    onChange={(e) =>
                      setNewTopic({ ...newTopic, author: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-400"
                    placeholder="IA Assistant"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Créer et générer l&lsquo;article
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Résumé des sujets existants */}
        <div className="rounded-lg bg-white shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Sujets traités ({topics.length})
            </h2>
            <p className="text-sm text-gray-500">
              Regroupement par sujet original avec statistiques
            </p>
          </div>

          {topics.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {topics.map((topic, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {topic.original_topic}
                      </h3>

                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Catégorie: {topic.category}</span>
                        <span>Articles: {topic.article_count}</span>
                        <span>
                          Dernière activité: {formatDate(topic.latest_created)}
                        </span>
                      </div>

                      {/* Statuts */}
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Statuts:</span>
                        {topic.statuses.map((statusInfo, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                              statusInfo.status
                            )}`}
                          >
                            {statusInfo.status} ({statusInfo.count})
                          </span>
                        ))}
                      </div>

                      {/* Tags */}
                      {topic.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {topic.tags.slice(0, 5).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {topic.tags.length > 5 && (
                            <span className="inline-flex rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">
                              +{topic.tags.length - 5} autres
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex items-center space-x-2">
                      <Link
                        href={`/admin/articles?topic=${encodeURIComponent(
                          topic.original_topic
                        )}`}
                        className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        Voir articles
                      </Link>
                      <button
                        onClick={() => handleProcessTopic(topic.original_topic)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        disabled={
                          getGenerationStatus()?.status ===
                          "generating"
                        }
                      >
                        {getGenerationStatus()?.status ===
                        "generating"
                          ? "En cours..."
                          : "Générer article"}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun sujet trouvé
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Créez votre premier sujet pour générer des articles.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowNewForm(true)}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Créer un sujet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
