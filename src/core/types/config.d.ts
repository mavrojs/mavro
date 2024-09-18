/**
 * Database configuration options.
 * @property {string} type - The type of database (e.g., postgres, mysql).
 * @property {string} host - The host of the database server.
 * @property {number} port - The port number for the database.
 * @property {string} username - The username to connect to the database.
 * @property {string} password - The password for the database user.
 * @property {string} database - The name of the database to connect to.
 */
export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/**
 * Redis-specific cache configuration.
 * @property {string} host - The Redis server host.
 * @property {number} port - The port for Redis.
 */
export interface RedisConfig {
  host: string;
  port: number;
}

/**
 * Memcached-specific cache configuration.
 * @property {string} host - The Memcached server host.
 * @property {number} port - The port for Memcached.
 */
export interface MemcachedConfig {
  host: string;
  port: number;
}

/**
 * Disk-based cache configuration.
 * @property {string} path - The file system path where cache files will be stored.
 */
export interface DiskCacheConfig {
  path: string;
}

/**
 * Cache configuration options.
 * @property {string} type - The cache type to use (e.g., redis, memcached, disk, memory).
 * @property {RedisConfig} [redis] - Configuration options for Redis, if used.
 * @property {MemcachedConfig} [memcached] - Configuration options for Memcached, if used.
 * @property {DiskCacheConfig} [disk] - Configuration options for disk-based caching, if used.
 */
export interface CacheConfig {
  type: string;
  redis?: RedisConfig;
  memcached?: MemcachedConfig;
  disk?: DiskCacheConfig;
}

/**
 * General application configuration.
 * @property {number} port - The port on which the application will run.
 * @property {DatabaseConfig} database - Database configuration.
 * @property {CacheConfig} cache - Cache configuration options.
 * @property {string} environment - The current application environment (e.g., development, production).
 */
export interface Config {
  port: number;
  database: DatabaseConfig;
  cache: CacheConfig;
  environment: string;
}