import { Sequelize } from 'sequelize';
import mongoose, { ConnectOptions } from 'mongoose'; // Change ConnectionOptions to ConnectOptions
import { DatabaseConfig } from '../types';

export class Database {
  private sequelize?: Sequelize;
  private mongooseConnection?: typeof mongoose;

  constructor(private config: DatabaseConfig) {}

  async connect(): Promise<void> {
    switch (this.config.type) {
      case 'mysql':
      case 'postgres':
      case 'sqlite':
      case 'mariadb':
      case 'mssql':
        await this.connectSequelize();
        break;
      case 'mongodb':
        await this.connectMongoDB();
        break;
      default:
        throw new Error(`Unsupported database type: ${this.config.type}`);
    }
  }

  private async connectSequelize(): Promise<void> {
    const { host, port, username, password, database, type } = this.config;
    this.sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect: type as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql',
    });

    try {
      await this.sequelize.authenticate();
      console.log(`Connected to ${type} database`);
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw new Error(`Unable to connect to the ${type} database`);
    }
  }

  private async connectMongoDB(): Promise<void> {
    const { host, port, database, username, password } = this.config;
    const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;

    try {
      this.mongooseConnection = await mongoose.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      } as ConnectOptions); // Change ConnectionOptions to ConnectOptions
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Unable to connect to MongoDB:', error);
      throw new Error('Unable to connect to MongoDB');
    }
  }

  getSequelize(): Sequelize | undefined {
    return this.sequelize;
  }

  getMongoose(): typeof mongoose | undefined {
    return this.mongooseConnection;
  }

  getConfig(): DatabaseConfig {
    return this.config;
  }
}
