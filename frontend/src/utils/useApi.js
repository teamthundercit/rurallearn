import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { setAuthToken } from '../services/api';

/**
 * Custom hook to configure API client with Auth0 token
 * This hook automatically sets the authorization header when the user is authenticated
 */
const useApi = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const configureApi = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
              scope: 'openid profile email'
            }
          });
          setAuthToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
          setAuthToken(null);
        }
      } else {
        setAuthToken(null);
      }
    };

    configureApi();
  }, [isAuthenticated, getAccessTokenSilently]);

  return api;
};

export default useApi;
