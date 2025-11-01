import { ActiveJob, Article, BatchArticlesRequest, BatchArticlesResponse, CreateArticleData, DashboardArticleRequest, DashboardGenerationStats, DashboardMetrics, DashboardResponse, GenerationJobResponse, ImagePrompt, JobStatusResponse, PaginatedArticlesResponse, UpdateArticleData } from "@/types/ApiTypes";

// ===== DASHBOARD API =====

export async function generateArticleFromDashboard(
  data: DashboardArticleRequest
): Promise<GenerationJobResponse> {
  return request<GenerationJobResponse>("/dashboard/generate-article", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function processArticleFromDashboard(
  articleId: string
): Promise<GenerationJobResponse> {
  return request<GenerationJobResponse>(
    `/dashboard/process-article/${articleId}`,
    {
      method: "POST",
    }
  );
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return request<JobStatusResponse>(`/dashboard/jobs/${jobId}`);
}

export async function getActiveJobs(): Promise<ActiveJob[]> {
  return request<ActiveJob[]>("/dashboard/active-jobs");
}

export async function getExtendedDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/dashboard/extended");
}

export async function getDashboardGenerationStats(): Promise<DashboardGenerationStats> {
  return request<DashboardGenerationStats>("/dashboard/generation-stats");
}

export async function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/dashboard");
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return request<DashboardMetrics>("/dashboard/metrics");
}

// ===== ARTICLES API =====

export async function getArticles(
  params: {
    page?: number;
    limit?: number;
    domain?: string;
    category?: string;
    search?: string;
  } = {}
): Promise<PaginatedArticlesResponse> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  return request<PaginatedArticlesResponse>(
    `/articles?${queryParams.toString()}`
  );
}

export async function generateArticleStandard(data: {
  topic: string;
  category: string;
  domain: string;
  imagePrompt?: ImagePrompt;
}): Promise<Article> {
  return request<Article>("/articles/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function enrichArticle(articleId: string): Promise<Article> {
  return request<Article>(`/articles/${articleId}/enrich`, {
    method: "POST",
  });
}

export async function createEnrichedArticle(
  data: CreateArticleData
): Promise<Article> {
  return request<Article>("/articles/create-enriched", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function checkArticleExists(
  topic: string,
  domain: string
): Promise<{ exists: boolean }> {
  const queryParams = new URLSearchParams({ topic, domain });
  return request<{ exists: boolean }>(
    `/articles/exists?${queryParams.toString()}`
  );
}

export async function updateArticle(
  articleId: string,
  data: UpdateArticleData
): Promise<Article> {
  return request<Article>(`/articles/${articleId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteArticle(articleId: string): Promise<void> {
  return request<void>(`/articles/${articleId}`, {
    method: "DELETE",
  });
}

export async function getArticleById(articleId: string): Promise<Article> {
  return request<Article>(`/articles/${articleId}`);
}

export async function fixInternalLinksLanguage(
  articleId: string
): Promise<Article> {
  return request<Article>(`/articles/${articleId}/fix-links-language`, {
    method: "POST",
  });
}

export async function createBatchArticles(
  data: BatchArticlesRequest
): Promise<BatchArticlesResponse> {
  return request<BatchArticlesResponse>("/articles/batch", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export const apiService = {
  generateArticleFromDashboard,
  processArticleFromDashboard,
  getJobStatus,
  getActiveJobs,
  getExtendedDashboard,
  getDashboardGenerationStats,
  getDashboard,
  getDashboardMetrics,
  getArticles,
  generateArticleStandard,
  enrichArticle,
  createEnrichedArticle,
  checkArticleExists,
  updateArticle,
  deleteArticle,
  getArticleById,
  fixInternalLinksLanguage,
  createBatchArticles,
};