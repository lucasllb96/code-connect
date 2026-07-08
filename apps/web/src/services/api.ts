export const API_BASE_URL = 'http://localhost:3000';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cc_token');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Ocorreu um erro inesperado.';
    try {
      const errorData = await response.json();
      if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      } else if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(', ');
      }
    } catch {
      // Failed to parse JSON error response, use default message or status text
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new ApiError(errorMessage, response.status);
  }

  // Se a resposta for 204 No Content, não há body para parsear
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
