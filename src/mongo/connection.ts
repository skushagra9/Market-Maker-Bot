import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
class DbConnection {
  private static db: Db | null = null;
  private static instance: number = 0;
  private static url: string = process.env.MONGO_URI as string;

  private static async DbConnect(): Promise<Db> {
    try {
      const client = await MongoClient.connect(this.url);
      return client.db();
    } catch (e) {
      throw new Error(`Failed to connect to the database: ${e}`);
    }
  }

  public static async Get(): Promise<Db> {
    try {
      this.instance++; // this is just to count how many times our singleton is called.
      console.log(`DbConnection called ${this.instance} times`);

      if (this.db) {
        console.log('DB connection is already alive');
        return this.db;
      } else {
        console.log('Getting new DB connection');
        this.db = await this.DbConnect();
        return this.db;
      }
    } catch (e) {
      throw new Error(`Failed to get the database connection: ${e}`);
    }
  }
}

export default DbConnection;

