import { API_BASE_URL } from "./config";


export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
        cache: "no-store", //desactiver le cache
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: Record<string, unknown> = {};
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json().catch(() => ({}));
      } else {
        // Si ce n'est pas du JSON, lire comme texte
        const text = await response.text().catch(() => "");
        errorData = { message: text };
      }

      const errorMessage =
        (typeof errorData.message === 'string' ? errorData.message : null) ||
        (typeof errorData.error === 'string' ? errorData.error : null) ||
        `HTTP ${response.status}: ${response.statusText}`;
      console.error(`❌ Backend error [${response.status}]:`, errorData);

      throw new Error(errorMessage);
    }
     if (response.status === 304) {
      return {} as T; // Retourner un objet vide pour le 304
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}