import 'dotenv/config';
import { DataSource } from 'typeorm';
const dev = process.env.NODE_ENV === 'development';

export default new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || 'database.sqlite',
  entities: [
    !dev ? __dirname + '/../**/*.entity.ts' : __dirname + '/../**/*.entity.js',
  ],
  migrations: [!dev ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
