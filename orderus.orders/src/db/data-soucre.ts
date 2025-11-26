import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import path from 'path';
import { log } from 'console';

dotenv.config(); 

const env = process.env.NODE_ENV == 'dev' ? 'dev' : 'prod';

dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) }); // // it will add either the .env.prod fiel or .env.dev file and it will look at it if he didn't find the variable in the .env file


export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 3307),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
  charset: 'utf8mb4',
  timezone: 'Z',
};

export const dataSource = new DataSource(dataSourceOptions);

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
export default addTransactionalDataSource(dataSource);
