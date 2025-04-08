/// <reference types="vite/client" />

// ##########################################
// NOTE: This file is not part of the package.
// It's only function is to help development in testing and debugging.
// If you want to run the project locally you will need to update the authConfig object with your own auth provider
// ##########################################

import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthContext, AuthProvider } from './AuthContext';

// Get auth provider info from "https://keycloak.ofstad.xyz/realms/master/.well-known/openid-configuration"
/** @type {import('./types').TAuthConfig} */
const authConfig = {
  clientId: 'f642b4f2-3381-49cc-acf2-1dd59372d5cf',
  authorizationEndpoint: 'https://idm-dev.letsongo.com/oauth2/auth',
  tokenEndpoint: 'https://idm-dev.letsongo.com/oauth2/token',
  logoutEndpoint: 'https://idm-dev.letsongo.com/oauth2/sessions/logout',
  redirectUri: 'http://localhost:3000',
  logoutRedirect: 'http://localhost:3000/logout',
  onRefreshTokenExpire: (event) => event.logIn('', {}, 'popup'),
  preLogin: () => console.log('Logging in...'),
  postLogin: () => console.log('Logged in!'),
  decodeToken: true,
  scope: 'member:read member:write openid offline',
  state: 'testState12345678',
  clearURL: true,
  autoLogin: false,
  storage: 'session',
  refreshWithScope: false,
};

function LoginInfo() {
  const { tokenData, token, idTokenData, logIn, logOut, error, loginInProgress, idToken } = useContext(AuthContext);

  if (loginInProgress) return null;
  return (
    <>
      {error && <div style={{ color: 'red' }}>An error occurred during authentication: {error}</div>}
      <>
        <button onClick={() => logIn('', {}, 'popup')}>Log in w/popup</button>
        <button onClick={() => logIn()}>Log in w/redirect</button>
        <button onClick={() => logIn('customLoginState')}>Log in w/state</button>
        <button onClick={() => logIn('customLoginState', { scope: 'member:read member:write openid offline', remember: true })}>
          Log in w/extra params
        </button>
      </>
      {token ? (
        <>
          <button onClick={() => logOut('rememberThis', idTokenData?.session_state)}>Log out</button>
          <span style={{ margin: '0 10px' }}>
            Access token will expire at: {new Date(Number(localStorage.getItem('ROCP_tokenExpire')) * 1000).toLocaleTimeString()}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
              <h4>Access Token (JWT)</h4>
              <pre
                style={{
                  width: '400px',
                  margin: '10px',
                  padding: '5px',
                  border: 'black 2px solid',
                  wordBreak: 'break-all',
                  whiteSpace: 'break-spaces',
                }}
              >
                {token}
              </pre>
            </div>
            {authConfig.decodeToken && (
              <>
                <div>
                  <h4>Login Information from Access Token</h4>
                  <pre
                    style={{
                      width: '400px',
                      margin: '10px',
                      padding: '5px',
                      border: 'black 2px solid',
                      wordBreak: 'break-all',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {JSON.stringify(tokenData, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4>Login Information from ID Token</h4>
                  <pre
                    style={{
                      width: '400px',
                      margin: '10px',
                      padding: '5px',
                      border: 'black 2px solid',
                      wordBreak: 'break-all',
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    {JSON.stringify(idTokenData, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div style={{ backgroundColor: 'red' }}>You are not logged in</div>
      )}
    </>
  );
}

const container = document.getElementById('root');
if (!container) throw new Error('No container found');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <div>
      <h1>Demo using the &apos;react-oauth2-code-pkce&apos; package</h1>
      <p>
        Github: <a href="https://github.com/soofstad/react-oauth2-pkce">https://github.com/soofstad/react-oauth2-pkce</a>
      </p>
      <p>
        NPM: <a href="https://www.npmjs.com/package/react-oauth2-code-pkce">https://www.npmjs.com/package/react-oauth2-code-pkce</a>
      </p>
    </div>
    <AuthProvider authConfig={authConfig}>
      <LoginInfo />
    </AuthProvider>
  </React.StrictMode>,
);
