const API_URL = "http://localhost:8080";

export async function apiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  // DELETE requests return 204 and have no response body
  if (response.status === 204) {
    return null;
  }

  return response.json();
}