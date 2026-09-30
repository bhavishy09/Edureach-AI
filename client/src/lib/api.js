// Base API URL configuration
// In production on Vercel, this can be set via VITE_API_URL (e.g., https://edureach-ai-g0p0.onrender.com)
// In local development or when using Vercel rewrites proxy, it falls back to '' (relative path)
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Returns the resolved URL for a given API endpoint.
 * @param {string} endpoint - The endpoint path (e.g. '/api/chat')
 * @returns {string} - The full URL or relative path
 */
export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) return cleanEndpoint;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default apiUrl;
