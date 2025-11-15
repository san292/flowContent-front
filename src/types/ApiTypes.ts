export type DashboardArticleRequest = {
  title: string;
  topic: string;
  original_topic: string;
  description: string;
  category: string;
  domain: string;
  tags: string[];
  author: string;
};

export type GenerationJobResponse = {
  success: boolean;
  jobId?: string;
  articleId: string;
  message?: string;
  error?: string;
};

export type JobStatusResponse = {
  status: "pending" | "generating" | "completed" | "error";
  progress: number;
  startTime: string;
  endTime?: string;
  error?: string;
  articleId?: string;
  type: "article" | "video" | "audio";
};

// export type DashboardGenerationStats = {
//   inProgress: number;
//   completed: number;
//   failed: number;
//   averageGenerationTime: number;
//   totalJobsToday: number;
// };

export type Article = {
  id: string;
  title: string;
  topic: string;
  original_topic?: string;
  description?: string;
  content: string;
  slug: string;
  image?: string;
  image_url?: string;
  category?: string;
  domain: string;
  tags?: string[];
  author?: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at?: string;
  published_at?: string;
};

export type PaginatedArticlesResponse = {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ActiveJob = {
  id: string;
  status: "pending" | "generating" | "completed" | "error";
  progress: number;
  articleId?: string;
  startTime: string;
};

// export type DashboardResponse = {
//   stats: DashboardGenerationStats;
//   recentArticles: Article[];
//   activeJobs: ActiveJob[];
// };

export type DashboardMetrics = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  articlesThisMonth: number;
  articlesThisWeek: number;
};

export type ImagePrompt = {
  description: string;
  style?: string;
  mood?: string;
  colors?: string;
};

export type CreateArticleData = {
  topic: string;
  category: string;
  domain: string;
  imagePrompt?: ImagePrompt;
  image?: string;
  imageUrl?: string;
};

export type UpdateArticleData = {
  title?: string;
  description?: string;
  content?: string;
  status?: "draft" | "published" | "archived";
  image?: string;
  image_url?: string;
  category?: string;
  tags?: string[];
  domain?:string
  author?:string
  published_at?:string
};

export type DeleteArticleResponse = {
  success: boolean;
  message: string;
};

export type BatchArticlesRequest = {
  topics: string[];
  category: string;
  domain: string;
};

export type BatchArticlesResponse = {
  success: boolean;
  created: number;
  failed: number;
  articles: Article[];
};
export type DashboardGenerationStats = {
  articlesGenerated: number;
  imagesCreated: number;
  videosGenerated: number;
  audiosGenerated: number;
  averageTime: number;
  successRate: number;
};

export type DashboardActivity = {
  id: string;
  title: string;
  type: "success" | "error";
  domain: string;
  timestamp: string;
};

export type DashboardDomainStats = {
  domain: string;
  articles: number;
  images: number;
  videos: number;
  audios: number;
  successRate: number;
};

export type DashboardResponse = {
  stats: DashboardGenerationStats;
  recentActivity: DashboardActivity[];
  domainStats: DashboardDomainStats[];
};