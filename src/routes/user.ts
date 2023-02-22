import { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  checkUser,
} from '../controllers/user';

const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.post('/get', getUser);
userRouter.post('/update', updateUser);
userRouter.post('/delete', deleteUser);
userRouter.post('/check-user', checkUser);

export { userRouter };
