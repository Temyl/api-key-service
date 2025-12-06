// src/migrations/migration.config.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { ApiKey } from '../entities/service.key';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [User, ApiKey], 
  migrations: ['src/db/migrations/*.ts'],
  subscribers: [],
});

console.log(process.env.DB_PASSWORD, process.env.DB_NAME )
