import {
  ActiveJob,
  Article,
  BatchArticlesRequest,
  BatchArticlesResponse,
  CreateArticleData,
  DashboardArticleRequest,
  DashboardGenerationStats,
  DashboardMetrics,
  DashboardResponse,
  DeleteArticleResponse,
  GenerationJobResponse,
  ImagePrompt,
  JobStatusResponse,
  PaginatedArticlesResponse,
  UpdateArticleData,
  SocialMediaKitRequest,
  SocialMediaKitResponse,
} from "@/types/ApiTypes";
import { request } from "./apiHelpers";
import { API_BASE_URL } from "./config";

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

export async function processArticleByTopic(
  originalTopic: string
): Promise<GenerationJobResponse> {
  return request<GenerationJobResponse>(`/dashboard/process-article-by-topic`, {
    method: "POST",
    body: JSON.stringify({ originalTopic }),
  });
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

export async function getPublicArticles(
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
    if (value !== undefined && value !== "")
      queryParams.append(key, String(value));
  });

  return request<PaginatedArticlesResponse>(
    `/articles/public?${queryParams.toString()}`,

  );
}

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
    `/articles?${queryParams.toString()}`,
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

export async function deleteArticle(articleId: string): Promise<DeleteArticleResponse> {
  return request<DeleteArticleResponse>(`/articles/${articleId}`, {
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

export async function getArticleBySlug(slug: string): Promise<Article> {
  return request<Article>(`/articles/public/${slug}`);
}

// ===== SOCIAL MEDIA API =====

export async function generateSocialContent(
  data: import("@/types/ApiTypes").SocialContentRequest
): Promise<import("@/types/ApiTypes").SocialContentResponse> {
  return request<import("@/types/ApiTypes").SocialContentResponse>(
    "/social-media/generate",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function generateSocialContentAll(
  data: import("@/types/ApiTypes").SocialGenerateAllRequest
): Promise<import("@/types/ApiTypes").SocialGenerateAllResponse> {
  return request<import("@/types/ApiTypes").SocialGenerateAllResponse>(
    "/social-media/generate/all",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getSocialPosts(params: {
  limit?: number;
  page?: number;
} = {}): Promise<import("@/types/ApiTypes").SocialPostsResponse> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  return request<import("@/types/ApiTypes").SocialPostsResponse>(
    `/social-media?${queryParams.toString()}`
  );
}

export async function schedulePost(
  data: import("@/types/ApiTypes").SchedulePostRequest
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(
    "/social-media/schedule",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getScheduledPosts(params: {
  platform?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
} = {}): Promise<{ success: boolean; data: import("@/types/ApiTypes").ScheduledPost[] }> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  return request<{ success: boolean; data: import("@/types/ApiTypes").ScheduledPost[] }>(
    `/social-media/scheduled?${queryParams.toString()}`
  );
}

export async function deleteScheduledPost(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/social-media/scheduled/${id}`, {
    method: "DELETE",
  });
}

export async function publishScheduledPost(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/social-media/scheduled/${id}/publish`, {
    method: "POST",
  });
}

// ===== SOCIAL MEDIA KIT API =====

export async function generateSocialMediaKit(
  data: SocialMediaKitRequest,
  generateImages = true
): Promise<SocialMediaKitResponse> {
  const queryParams = new URLSearchParams({
    format: 'json',
    generateImages: generateImages.toString(),
  });

  return request<SocialMediaKitResponse>(
    `/social-media/export?${queryParams.toString()}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function generateSocialMediaKitHTML(
  data: SocialMediaKitRequest
): Promise<string> {
  const queryParams = new URLSearchParams({
    format: 'html',
    generateImages: 'true',
  });

  const response = await fetch(
    `${API_BASE_URL}/social-media/export?${queryParams.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate HTML kit');
  }

  return response.text();
}

// ===== VIDEOS SVD API =====
export * from './videosSvd';

export const apiService = {
  generateArticleFromDashboard,
  processArticleFromDashboard,
  processArticleByTopic,
  getJobStatus,
  getActiveJobs,
  getExtendedDashboard,
  getDashboardGenerationStats,
  getDashboard,
  getDashboardMetrics,
  getArticles,
  getPublicArticles,
  generateArticleStandard,
  enrichArticle,
  createEnrichedArticle,
  checkArticleExists,
  updateArticle,
  deleteArticle,
  getArticleById,
  fixInternalLinksLanguage,
  createBatchArticles,
  getArticleBySlug,

  // Social Media
  generateSocialContent,
  generateSocialContentAll,
  getSocialPosts,
  schedulePost,
  getScheduledPosts,
  deleteScheduledPost,
  publishScheduledPost,

  // Social Media Kit
  generateSocialMediaKit,
  generateSocialMediaKitHTML,
};
