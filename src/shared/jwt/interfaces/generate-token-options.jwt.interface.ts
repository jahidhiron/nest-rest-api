export interface IGenerateTokenOptions {
  secret?: string;
  expiresIn?: string | number;
  issuer?: string;
  audience?: string;
}
