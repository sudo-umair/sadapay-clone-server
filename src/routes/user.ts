import { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  resumeSession,
} from '../controllers/user';

const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.post('/get', getUser);
userRouter.post('/update', updateUser);
userRouter.post('/delete', deleteUser);
userRouter.post('/resume', resumeSession);

export { userRouter };
