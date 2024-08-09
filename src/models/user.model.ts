import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the user document
interface IUser extends Document {
  // Define the user document fields here
  // Example: name: string;
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {
    // Define the schema fields here
    // Example: name: { type: String, required: true }
  },
  { timestamps: true }
);

// Pre middlewares will be written here

// Define and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
