import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType } from "react";
import { LoadingSpinner } from "../components/common/loading-spinner";

interface AuthGuardProps {
  component: ComponentType;
}

export const AuthGuard = ({ component }: AuthGuardProps) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <LoadingSpinner />,
  });

  return <Component />;
};