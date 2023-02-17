import { Schema, model, Model, Document } from 'mongoose';
import { UserModel, IUserDocument } from './user';

export interface ITransaction {
  title: string;
  amount: number;
  date: Date;
  from: {
    name: string;
    phone: string;
  };
  to: {
    name: string;
    phone: string;
  };
}

export interface ITransactionDocument extends ITransaction, Document {
  handleTransaction: () => Promise<void>;
  resetMonthlyLimits: () => Promise<void>;
}

export type TInteractionModel = Model<ITransactionDocument>;

const transactionSchema = new Schema<ITransaction, TInteractionModel>(
  {
    title: {
      type: String,
      required: true,
      default: 'Money Transfer',
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    from: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    to: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.methods.handleTransaction = async function () {
  const transaction = this as ITransactionDocument;

  const receiver = await UserModel.findOne({ phone: transaction.to.phone });
  if (!receiver) {
    throw new Error('Receiver not found');
  }

  receiver.balance += transaction.amount;
  receiver.monthlyLimit -= transaction.amount;
  await receiver.save();

  const sender = await UserModel.findOne({ phone: transaction.from.phone });
  if (!sender) {
    throw new Error('Sender not found');
  }

  sender.balance -= transaction.amount;
  receiver.monthlyLimit += transaction.amount;
  await sender.save();
};

export const TransactionModel = model<ITransactionDocument, TInteractionModel>(
  'Transaction',
  transactionSchema
);
