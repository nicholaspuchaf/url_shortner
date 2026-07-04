export type EnvironmentConfig = {
  backendUrl: string
  appName: string
  appVersion: string
  supportEmail: string
}

export const environment: EnvironmentConfig = {
  backendUrl: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000',
  appName: 'TinyURL',
  appVersion: '0.0.0',
  supportEmail: 'support@tinyurl.com',
};

export default environment;
