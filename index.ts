// imports
import dotenv from 'dotenv';
import { connectDB } from './src/db/connect';
import { app } from './src/app';
import { PORT } from './src/constants';

// dotenv configuration
dotenv.config();

// database connection promise
connectDB()
  .then(() => {
    app.listen(process.env.PORT || PORT, () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT || PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('MONGO db connection failed !!! ', err);
  });
