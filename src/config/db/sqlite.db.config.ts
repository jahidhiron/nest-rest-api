import { NamingStrategy } from './naming-strategy.config';

const env = process.env.NODE_ENV || 'development';

export const sqliteDbConfig = () => ({
  database: {
    type: process.env.DB_TYEP || 'sqlite',
    database: process.env.DB_PATH || 'database.sqlite',
    synchronize: env === 'development' || env === 'test',
    logging: env === 'development',
    namingStrategy: new NamingStrategy(),
  },
});
