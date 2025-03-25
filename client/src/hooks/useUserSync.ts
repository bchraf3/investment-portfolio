import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthenticatedApi } from './useAuthApi';

export function useUserSync() {
  const { isAuthenticated, isLoading} = useAuth0();
  const { postSecured } = useAuthenticatedApi();
  const [isUserSynced, setIsUserSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function syncUser() {
      if (isAuthenticated && !isLoading) {
        try {
          
          await postSecured('api/users/sync', {});
          console.log('User Synced Successfully');
          
          setIsUserSynced(true);
          setError(null);
          
        } catch (err) {
          console.error('Error syncing user:', err);
          setError('Failed to sync your user profile');
          setIsUserSynced(false);
        }
      }
    }
    
    syncUser();
  }, [isAuthenticated, isLoading, postSecured]);

  return { isUserSynced, error };
}