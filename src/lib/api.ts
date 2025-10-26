// lib/api.ts - Service API pour votre backend NestJS
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';

export interface DashboardArticleRequest {
    title: string;
    topic: string;
    original_topic: string;
    description: string;
    category: string;
    domain: string;
    tags: string[];
    author: string;
}

export interface GenerationJobResponse {
    success: boolean;
    jobId?: string;
    articleId: string; 
    message?: string;
    error?: string;
}

export interface JobStatusResponse {
    status: 'pending' | 'generating' | 'completed' | 'error';
    progress: number;
    startTime: string;
    endTime?: string;
    error?: string;
    articleId?: string;
    type: 'article' | 'video' | 'audio';
}

export interface DashboardGenerationStats {
    inProgress: number;
    completed: number;
    failed: number;
    averageGenerationTime: number;
    totalJobsToday: number;
}

class ApiService {

    constructor() {
        console.log('API_BASE_URL:', API_BASE_URL); // Doit afficher http://localhost:4000
    }
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;


        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // === ROUTES DASHBOARD ===

    async generateArticleFromDashboard(data: DashboardArticleRequest): Promise<GenerationJobResponse> {
        return this.request<GenerationJobResponse>('/dashboard/generate-article', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async processArticleFromDashboard(articleId: string): Promise<GenerationJobResponse> {
        return this.request<GenerationJobResponse>(`/dashboard/process-article/${articleId}`, {
            method: 'POST',
        });
    }

    async getJobStatus(jobId: string): Promise<JobStatusResponse> {
        return this.request(`/dashboard/jobs/${jobId}`);
    }

    async getActiveJobs(): Promise<any[]> {
        return this.request('/dashboard/active-jobs');
    }

    async getExtendedDashboard(): Promise<any> {
        return this.request('/dashboard/extended');
    }

    async getDashboardGenerationStats(): Promise<DashboardGenerationStats> {
        return this.request('/dashboard/generation-stats');
    }

    async getDashboard(): Promise<any> {
        return this.request('/dashboard');
    }

    async getDashboardMetrics(): Promise<any> {
        return this.request('/dashboard/metrics');
    }

    // === ROUTES ARTICLES ===

    async getArticles(params: {
        page?: number;
        limit?: number;
        domain?: string;
        category?: string;
        search?: string;
    } = {}): Promise<any> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return this.request(`/articles?${queryParams.toString()}`);
    }

    async generateArticleStandard(data: {
        topic: string;
        category: string;
        domain: string;
        imagePrompt: any;
    }): Promise<any> {
        return this.request('/articles/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async enrichArticle(articleId: string): Promise<any> {
        return this.request(`/articles/${articleId}/enrich`, {
            method: 'POST',
        });
    }

    async createEnrichedArticle(data: {
        topic: string;
        category: string;
        domain: string;
        imagePrompt?: any;
        image?: string;
        imageUrl?: string;
    }): Promise<any> {
        return this.request('/articles/create-enriched', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async checkArticleExists(topic: string, domain: string): Promise<{ exists: boolean }> {
        const queryParams = new URLSearchParams({ topic, domain });
        return this.request(`/articles/exists?${queryParams.toString()}`);
    }

    async updateArticle(articleId: string, data: any): Promise<any> {
        return this.request(`/articles/${articleId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteArticle(articleId: string): Promise<void> {
        return this.request(`/articles/${articleId}`, {
            method: 'DELETE',
        });
    }

    async getArticleById(articleId: string): Promise<any> {
        return this.request(`/articles/${articleId}`);
    }

    async fixInternalLinksLanguage(articleId: string): Promise<any> {
        return this.request(`/articles/${articleId}/fix-links-language`, {
            method: 'POST',
        });
    }

    async createBatchArticles(data: {
        topics: string[];
        category: string;
        domain: string;
    }): Promise<any> {
        return this.request('/articles/batch', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiService = new ApiService();