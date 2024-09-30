import dotenv from 'dotenv';
import { Config  } from '../types';
dotenv.config();

/**
 * The application configuration loaded from environment variables.
 * Provides unified access to database, cache, and general configurations.
 */
export const config: Config = {
  host: process.env.HOST || 'http://localhost',
  port: Number(process.env.PORT) || 1337,
  database: {
    type: process.env.DB_TYPE as 'mysql' | 'sqlite' | 'postgres' | 'mongodb' | 'mariadb' | 'mssql' || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydatabase',
  },
  cache: {
    type: process.env.CACHE_TYPE || 'memory',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    memcached: {
      host: process.env.MEMCACHED_HOST || 'localhost',
      port: Number(process.env.MEMCACHED_PORT) || 11211,
    },
    disk: {
      path: process.env.CACHE_DISK_PATH || './cache',
    },
  },
  
  environment: process.env.NODE_ENV || 'development',
};
