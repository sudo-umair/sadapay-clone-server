import { Router } from 'express';
import { createUser, getUser, updateUser } from '../controllers/user';

const userRouter = Router();

userRouter.post('/create', createUser);
userRouter.post('/get', getUser);
userRouter.post('/update', updateUser);

export { userRouter };
