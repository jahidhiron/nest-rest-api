export const swaggerConfig = () => ({
  swaggerUser: process.env.SWAGGER_USER,
  swaggerPassword: process.env.SWAGGER_PASSWORD,
  swaggerDevelopmentBaseUrl: process.env.SWAGGER_DEVELOPMENT_BASE_URL,
  swaggerLiveBaseUrl: process.env.SWAGGER_LIVE_BASE_URL,
});
