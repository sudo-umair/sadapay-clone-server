import mongoose from 'mongoose';
import { CONSTANTS } from './utils/constants';

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    await mongoose
      .connect(CONSTANTS.MONGO_URI)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};
