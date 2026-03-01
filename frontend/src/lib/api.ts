/**
 * FoodExpress API client
 *
 * Railway Setup: Set VITE_API_BASE_URL in frontend service variables to:
 *   https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
 * This auto-connects frontend → backend using Railway reference variables.
 */

// Dynamic API URL depending on the environment
export const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://online-food-ordering-project-production.up.railway.app/api";

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
