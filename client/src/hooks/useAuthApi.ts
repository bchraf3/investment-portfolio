import { useAuth0 } from '@auth0/auth0-react';
import { apiService } from '../services/api';

export const useAuthenticatedApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getSecured = async <T>(endpoint: string): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      return apiService.get<T>(endpoint, token);
    } catch (error) {
      console.error('Error fetching secured resource:', error);
      throw error;
    }
  };

  const postSecured = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      return apiService.post<T>(endpoint, data, token);
    } catch (error) {
      console.error('Error posting secured resource:', error);
      throw error;
    }
  };

  const putSecured = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      return apiService.put<T>(endpoint, data, token);
    } catch (error) {
      console.error('Error updating secured resource:', error);
      throw error;
    }
  };

  const deleteSecured = async <T>(endpoint: string): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      return apiService.delete<T>(endpoint, token);
    } catch (error) {
      console.error('Error deleting secured resource:', error);
      throw error;
    }
  };

  return {
    // Auth-protected methods
    getSecured,
    postSecured,
    putSecured,
    deleteSecured,
    
    // Direct access to the original methods (for public endpoints)
    get: apiService.get,
    post: apiService.post,
    put: apiService.put,
    delete: apiService.delete
  };
};