export const auth0Config = {
    domain: 'your-tenant.auth0.com',
    clientId: 'your-client-id',
    audience: 'https://investment-portfolio-api',
    redirectUri: window.location.origin + '/callback',
    scope: 'openid profile email read:portfolios write:portfolios'
  };