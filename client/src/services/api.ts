import { API_URL } from '../config';

class ApiService {
  // Private request method that centralizes the logic
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options: RequestInit = {
      method,
      headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_URL}/${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  // Public methods with optional token parameter
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, token);
  }

  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>('POST', endpoint, data, token);
  }

  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>('PUT', endpoint, data, token);
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, token);
  }
}

export const apiService = new ApiService();