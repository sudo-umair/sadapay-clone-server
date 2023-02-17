import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transaction';

const transactionRouter = Router();

transactionRouter.post('/create', createTransaction);
transactionRouter.post('/get', getTransactions);

export { transactionRouter };
