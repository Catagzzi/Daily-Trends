import mongoose from 'mongoose';

class Database {
  private static instance: Database;
  private readonly mongoUri: string;

  private constructor() {
    this.mongoUri = process.env.MONGO_URI || '';
    if (!this.mongoUri) {
      console.error('ERROR: Mongo URI is not defined');
      process.exit(1);
    }

    mongoose.connection.on('connected', () => {
      console.log('MongoDB: Connected successfully.');
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUri);
    } catch (err) {
      console.error('MongoDB: Connection failed:', err);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}

export const mongoDB = Database.getInstance();
