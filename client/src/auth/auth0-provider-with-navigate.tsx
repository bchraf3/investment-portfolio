import { Auth0Provider } from "@auth0/auth0-react";
import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

// Custom wrapper component that combines Auth0Provider with React Router navigation
export const Auth0ProviderWithNavigate = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL || "";
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

  // Callback function that navigates to the intended page after successful login
  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Safety check to ensure all required Auth0 configuration is available
  if (!(domain && clientId && redirectUri && audience)) {
    return null;
  }

  // Render the Auth0Provider with all required configuration
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};