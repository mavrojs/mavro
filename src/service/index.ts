import { Database } from '../database';
import { DatabaseConfig } from '../types';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { ClientSession } from 'mongoose';

type TransactionSession = ClientSession | SequelizeTransaction;

export class Service {
  protected db: Database;

  constructor(databaseConfig: DatabaseConfig) {
    this.db = new Database(databaseConfig);
    this.connectDatabase();
  }

  private async connectDatabase(): Promise<void> {
    await this.db.connect();
  }

  async findById<T>(model: any, id: string, session?: TransactionSession): Promise<T | null> {
    try {
      const record =
        (await model.findById(id, { session })) ||
        (await model.findByPk(id, { transaction: session }));

      return record ? (record.toJSON() as T) : null;
    } catch (error) {
      console.error(`Error finding record by ID ${id}:`, error);
      throw new Error('Database operation failed');
    }
  }

  async findAll<T>(model: any, session?: TransactionSession): Promise<T[]> {
    try {
      const records = (await model.find({ session })) || (await model.findAll({ transaction: session }));
      return records.map((record: any) => record.toJSON() as T);
    } catch (error) {
      console.error(`Error finding records:`, error);
      throw new Error('Database operation failed');
    }
  }

  async create<T>(model: any, data: Partial<T>, session?: TransactionSession): Promise<T> {
    try {
      const record = await model.create(data, { session });
      return record.toJSON() as T;
    } catch (error) {
      console.error(`Error creating record:`, error);
      throw new Error('Database operation failed');
    }
  }

  async update<T>(model: any, id: string, data: Partial<T>, session?: TransactionSession): Promise<T | null> {
    try {
      const record =
        (await model.findById(id, { session })) ||
        (await model.findByPk(id, { transaction: session }));

      if (!record) {
        throw new Error('Record not found');
      }

      await record.update(data, { transaction: session });
      return record.toJSON() as T;
    } catch (error) {
      console.error(`Error updating record by ID ${id}:`, error);
      throw new Error('Database operation failed');
    }
  }
  
  async delete(model: any, id: string, session?: TransactionSession): Promise<boolean> {
    try {
      const record =
        (await model.findById(id)) || (await model.findByPk(id));
      if (!record) {
        throw new Error('Record not found');
      }

      await record.remove({ session }) || await record.destroy({ transaction: session });
      return true;
    } catch (error) {
      console.error(`Error deleting record by ID ${id}:`, error);
      throw new Error('Database operation failed');
    }
  }

  async transaction<T>(callback: (session: TransactionSession) => Promise<T>): Promise<T> {
    const dbType = this.db.getConfig().type; // Use getConfig to access the database type

    if (dbType === 'mongodb') {
      const session: ClientSession = await this.db.getMongoose()?.startSession()!;
      session.startTransaction();
      try {
        const result = await callback(session);
        await session.commitTransaction();
        return result;
      } catch (error) {
        await session.abortTransaction();
        console.error('Transaction rolled back:', error);
        throw new Error('Transaction failed');
      } finally {
        session.endSession();
      }
    } else if (dbType === 'mysql' || dbType === 'postgres' || dbType === 'sqlite') {
      const transaction: SequelizeTransaction = await this.db.getSequelize()?.transaction()!;
      try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
      } catch (error) {
        await transaction.rollback();
        console.error('Transaction rolled back:', error);
        throw new Error('Transaction failed');
      }
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}
