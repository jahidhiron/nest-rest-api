export interface IDatabaseConfig {
  type: 'sqlite' | 'mysql' | 'postgres';
  database: string;
  synchronize: boolean;
  logging: boolean;
}
