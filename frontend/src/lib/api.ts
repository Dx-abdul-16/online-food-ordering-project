/**
 * FoodExpress API client
 * 
 * Railway Setup: Set VITE_API_BASE_URL in frontend service variables to:
 *   https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
 * This auto-connects frontend → backend using Railway reference variables.
 */

// Build the API URL — ensure HTTPS for production
const rawUrl = import.meta.env.VITE_API_BASE_URL 
  || import.meta.env.VITE_BACKEND_HOST 
  || "https://online-food-ordering-project-production.up.railway.app/api";

// Force HTTPS in production to prevent Mixed Content errors
export const API_BASE_URL = rawUrl.replace(/^http:\/\//i, "https://");

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `API Error ${response.status}: ${response.statusText}`);
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
      throw new Error(err.message || `API Error ${response.status}: ${response.statusText}`);
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
      throw new Error(err.message || `API Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `API Error ${response.status}: ${response.statusText}`);
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
