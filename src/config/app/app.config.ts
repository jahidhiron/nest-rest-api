const env = process.env.NODE_ENV || 'development';

export const appConfig = () => ({
  env,
  logDir: process.env.LOG_DIR || 'logs',
  dev: env === 'development',
  staging: env === 'staging',
  prod: env === 'production',
  port: parseInt(process.env.PORT ?? '5000', 10),
  corsOrigin: process.env.CORS_ORIGIN,
  companyName: process.env.COMPANY_NAME,
  apiBaseUrl: process.env.API_BASE_URL,
  supportEmail: process.env.SUPPORT_EMAIL,
});
