import { Database } from "../database";
import { DatabaseConfig } from "../types";
import { Transaction as SequelizeTransaction } from "sequelize";
import { ClientSession } from "mongoose";

type TransactionSession = ClientSession | SequelizeTransaction;

export class Service {
  private static db: Database;
  private static isInitialized = false;

  private constructor() {}

  private static async initialize(
    databaseConfig: DatabaseConfig | undefined
  ): Promise<void> {
    if (!databaseConfig)
      throw new Error("Database config not passed to initialize it");
    if (!this.isInitialized) {
      this.db = new Database(databaseConfig);
      await this.db.connect();
      this.isInitialized = true;
    }
  }

  /**
   * Retrieves all records from the model's table, optionally filtered by specified criteria.
   *
   * @template T - The type of the returned records.
   * @param model - The model to query.
   * @param filters - Optional filters to apply to the query (e.g., conditions).
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns An array of all found records.
   */
  public static async all<T>(
    model: any,
    filters?: Record<string, any>, // Add filters parameter
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T[]> {
    await this.initialize(databaseConfig);
    try {
      // Adjust the query to apply filters
      const records =
        (await model.find({ ...filters, session })) || // For MongoDB
        (await model.findAll({ where: filters, transaction: session })); // For SQL databases

      return records.map((record: any) => record.toJSON() as T);
    } catch (error) {
      console.error(`Error retrieving all records:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Finds a record by its primary key.
   *
   * @template T - The type of the returned record.
   * @param model - The model to query.
   * @param id - The primary key of the record to find.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns The found record, or null if not found.
   */
  public static async find<T>(
    model: any,
    id: string,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T | null> {
    await this.initialize(databaseConfig); // Ensure the database is initialized
    try {
      const record =
        (await model.findById(id, { session })) ||
        (await model.findByPk(id, { transaction: session }));

      return record ? (record.toJSON() as T) : null;
    } catch (error) {
      console.error(`Error finding record by ID ${id}:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Finds a record by its primary key or throws a ModelNotFoundException.
   *
   * @template T - The type of the returned record.
   * @param model - The model to query.
   * @param id - The primary key of the record to find.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @throws ModelNotFoundException - Throws an error if the record is not found.
   * @returns The found record.
   */
  public static async findOrFail<T>(
    model: any,
    id: string,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T> {
    await this.initialize(databaseConfig); // Ensure the database is initialized
    try {
      const record =
        (await model.findById(id, { session })) ||
        (await model.findByPk(id, { transaction: session }));

      if (!record) {
        throw new Error("NotFoundException: Record not found");
      }

      return record.toJSON() as T;
    } catch (error) {
      console.error(`Error finding record by ID ${id}:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Retrieves records matching specified conditions.
   *
   * @template T - The type of the returned records.
   * @param model - The model to query.
   * @param column - The column name to filter by.
   * @param operator - The comparison operator (e.g., '=', '>', '<', '!=', etc.).
   * @param value - The value to compare against.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns An array of records matching the specified conditions.
   */
  public static async where<T>(
    model: any,
    column: string,
    operator: string,
    value: any,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T[]> {
    await this.initialize(databaseConfig); // Ensure the database is initialized
    try {
      // For MongoDB
      if (this.db.getConfig().type === "mongodb") {
        const records = await model.find(
          { [column]: { [`$${operator}`]: value } },
          { session }
        );
        return records.map((record: any) => record.toJSON() as T);
      }

      // For SQL databases (Postgres, MySQL, SQLite)
      const records = await model.findAll({
        where: {
          [column]: {
            [operator]: value,
          },
        },
        transaction: session,
      });
      return records.map((record: any) => record.toJSON() as T);
    } catch (error) {
      console.error(
        `Error retrieving records with condition ${column} ${operator} ${value}:`,
        error
      );
      throw new Error("Database operation failed");
    }
  }

  /**
   * Retrieves the first record that matches the query.
   *
   * @template T - The type of the returned record.
   * @param model - The model to query.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @param whereClause - Optional filter conditions to apply.
   * @returns The first matching record or null if no record is found.
   */
  public static async first<T>(
    model: any,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig,
    whereClause?: Record<string, any>
  ): Promise<T | null> {
    await this.initialize(databaseConfig); // Ensure the database is initialized
    try {
      // For MongoDB
      if (this.db.getConfig().type === "mongodb") {
        const record = await model.findOne(whereClause, { session });
        return record ? (record.toJSON() as T) : null;
      }

      // For SQL databases (Postgres, MySQL, SQLite)
      const record = await model.findOne({
        where: whereClause,
        transaction: session,
      });
      return record ? (record.toJSON() as T) : null;
    } catch (error) {
      console.error(`Error retrieving the first record:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Retrieves the first record that matches the query or throws a ModelNotFoundException.
   *
   * @template T - The type of the returned record.
   * @param model - The model to query.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @param whereClause - Optional filter conditions to apply.
   * @throws {Error} - Throws an error if no record is found.
   * @returns The first matching record.
   */
  public static async firstOrFail<T>(
    model: any,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig,
    whereClause?: Record<string, any>
  ): Promise<T> {
    await this.initialize(databaseConfig); // Ensure the database is initialized
    try {
      // For MongoDB
      if (this.db.getConfig().type === "mongodb") {
        const record = await model.findOne(whereClause, { session });
        if (!record) {
          throw new Error("ModelNotFoundException: No record found");
        }
        return record.toJSON() as T;
      }

      // For SQL databases (Postgres, MySQL, SQLite)
      const record = await model.findOne({
        where: whereClause,
        transaction: session,
      });
      if (!record) {
        throw new Error("ModelNotFoundException: No record found");
      }
      return record.toJSON() as T;
    } catch (error) {
      console.error(`Error retrieving the first record:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Finds a record by its ID.
   *
   * @template T - The type of the returned record.
   * @param model - The model to query.
   * @param id - The ID of the record to find.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns The found record or null if not found.
   */
  public static async findById<T>(
    model: any,
    id: string,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T | null> {
    await this.initialize(databaseConfig);
    try {
      const record =
        (await model.findById(id, { session })) ||
        (await model.findByPk(id, { transaction: session }));

      return record ? (record.toJSON() as T) : null;
    } catch (error) {
      console.error(`Error finding record by ID ${id}:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Finds all records for a given model, optionally filtered by specified criteria.
   *
   * @template T - The type of the returned records.
   * @param model - The model to query.
   * @param filters - Optional filters to apply to the query (e.g., conditions).
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns An array of found records.
   */
  public static async findAll<T>(
    model: any,
    filters?: Record<string, any>, // Add filters parameter
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T[]> {
    await this.initialize(databaseConfig);
    try {
      // Adjust the query to apply filters
      const records =
        (await model.find({ ...filters, session })) || // For MongoDB
        (await model.findAll({ where: filters, transaction: session })); // For SQL databases

      return records.map((record: any) => record.toJSON() as T);
    } catch (error) {
      console.error(`Error finding records:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Creates a new record in the database.
   *
   * @template T - The type of the record to create.
   * @param model - The model to use for creation.
   * @param data - The data for the new record.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns The created record.
   */
  public static async create<T>(
    model: any,
    data: Partial<T>,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T> {
    await this.initialize(databaseConfig);
    try {
      const record = await model.create(data, { session });
      return record.toJSON() as T;
    } catch (error) {
      console.error(`Error creating record:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Updates an existing record by its ID.
   *
   * @template T - The type of the record to update.
   * @param model - The model to use for updating.
   * @param id - The ID of the record to update.
   * @param data - The data to update in the record.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns The updated record or null if not found.
   */
  public static async update<T>(
    model: any,
    id: string,
    data: Partial<T>,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<T | null> {
    await this.initialize(databaseConfig);
    try {
      const record =
        (await model.findById(id, { session })) ||
        (await model.findByPk(id, { transaction: session }));

      if (!record) {
        throw new Error("Record not found");
      }

      await record.update(data, { transaction: session });
      return record.toJSON() as T;
    } catch (error) {
      console.error(`Error updating record by ID ${id}:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Deletes a record by its ID.
   *
   * @param model - The model to use for deletion.
   * @param id - The ID of the record to delete.
   * @param session - Optional transaction session.
   * @param databaseConfig - Optional database configuration.
   * @returns True if the record was deleted successfully.
   */
  public static async delete(
    model: any,
    id: string,
    session?: TransactionSession,
    databaseConfig?: DatabaseConfig
  ): Promise<boolean> {
    await this.initialize(databaseConfig);
    try {
      const record = (await model.findById(id)) || (await model.findByPk(id));
      if (!record) {
        throw new Error("Record not found");
      }

      (await record.remove({ session })) ||
        (await record.destroy({ transaction: session }));
      return true;
    } catch (error) {
      console.error(`Error deleting record by ID ${id}:`, error);
      throw new Error("Database operation failed");
    }
  }

  /**
   * Executes a transaction with a given callback.
   *
   * @template T - The type of the result returned from the callback.
   * @param callback - A function that receives a transaction session and returns a promise.
   * @param databaseConfig - Optional database configuration.
   * @returns The result of the callback function.
   */
  public static async transaction<T>(
    callback: (session: TransactionSession) => Promise<T>,
    databaseConfig?: DatabaseConfig
  ): Promise<T> {
    await this.initialize(databaseConfig);
    const dbType = this.db.getConfig().type;

    if (dbType === "mongodb") {
      const session: ClientSession = await this.db
        .getMongoose()
        ?.startSession()!;
      session.startTransaction();
      try {
        const result = await callback(session);
        await session.commitTransaction();
        return result;
      } catch (error) {
        await session.abortTransaction();
        console.error("Transaction rolled back:", error);
        throw new Error("Transaction failed");
      } finally {
        session.endSession();
      }
    } else if (
      dbType === "mysql" ||
      dbType === "postgres" ||
      dbType === "sqlite"
    ) {
      const transaction: SequelizeTransaction = await this.db
        .getSequelize()
        ?.transaction()!;
      try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
      } catch (error) {
        await transaction.rollback();
        console.error("Transaction rolled back:", error);
        throw new Error("Transaction failed");
      }
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}
