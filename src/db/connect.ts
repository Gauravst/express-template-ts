// This function is responsible for the connection with the DB.
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log('MONGODB connection FAILED', error);
    process.exit(1);
  }
};
