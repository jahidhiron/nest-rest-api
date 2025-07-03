export const jwtConfig = () => ({
  jwtSecretAccessToken:
    process.env.JWT_SECRET_ACCESS_TOKEN || 'SECRET_ACCESS_TOKEN',
  jwtSecretRefreshToken:
    process.env.JWT_SECRET_REFRESH_TOKEN || 'SECRET_REFRESH_TOKEN',
  jwtAccessTokenExpiredIn: parseInt(
    process.env.JWT_ACCESS_TOKEN_EXPIRED_IN || '86400',
    10,
  ),
  jwtRefreshTokenExpiredIn: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRED_IN || '2592000',
    10,
  ),
  jwtIssuer: process.env.JWT_ISSUER || 'netjet-api-test',
  jwtAudience: process.env.JWT_AUDIENCE || 'netjet-api-test',
});
