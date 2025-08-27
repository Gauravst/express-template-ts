// imports
import dotenv from 'dotenv';
import { app } from './src/app';
import { PORT } from './src/constants';

// dotenv configuration
dotenv.config();

// database connection promise
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running at port: ${process.env.PORT || PORT}`);
});
