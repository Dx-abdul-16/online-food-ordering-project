/**
 * FoodExpress API client
 *
 * All API requests use the relative /api path.
 * In production (Netlify), requests are proxied to the Railway backend via netlify.toml redirects.
 * In development, Vite's dev server proxy (vite.config.ts) handles the same proxy.
 */

export const API_BASE_URL = "/api";
export const API_HOST_URL = "";

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.message || `API Error ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.message || `API Error ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.message || `API Error ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.message || `API Error ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  },

  // Upload file (multipart/form-data)
  upload: async (endpoint: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData, // no Content-Type header — browser sets multipart boundary
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Upload Error ${response.status}`);
    }
    return response.json();
  },
};
