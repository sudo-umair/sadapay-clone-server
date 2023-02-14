import express from 'express';
import { CONSTANTS } from './utils/constants';
import { connectDB } from './db';
import { userRouter } from './routes/user';

connectDB();

const port = CONSTANTS.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`SadaPay Server is listening on port ${port}`);
});
