export type EnvironmentConfig = {
  backendUrl: string
  appName: string
  appVersion: string
  supportEmail: string
}

function resolveBackendUrl() {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
    return 'http://localhost:3000';
  }

  throw new Error('VITE_BACKEND_URL is required outside local development');
}

export const environment: EnvironmentConfig = {
  backendUrl: resolveBackendUrl(),
  appName: 'TinyURL',
  appVersion: '0.0.0',
  supportEmail: 'support@tinyurl.com',
};

export default environment;
