import { TransactionModel, ITransaction } from '../models/transaction';
import { UserModel, IUser } from '../models/user';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const createTransaction: RequestHandler = async (req, res) => {
  try {
    const { title, amount, date, from, to, token } =
      req.body as ITransaction & {
        token: string;
      };

    const transaction = new TransactionModel({
      title,
      amount,
      date,
      from,
      to,
    });

    await UserModel.findOne({ phone: from.phone })
      .then((user) => {
        if (user) {
          user
            .verifyAuthToken(token)
            .then(async (isMatch) => {
              if (isMatch) {
                await transaction
                  .save()
                  .then((transaction) => {
                    transaction.handleTransaction();
                    res.status(StatusCodes.CREATED).json({
                      message: 'Transaction created successfully',
                    });
                  })
                  .catch((error: Error) => {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                      message: 'Something went wrong',
                    });
                    console.error(error);
                  });
              } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                  message: 'Invalid token',
                });
              }
            })
            .catch((error: Error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
              });
              console.error(error);
            });
        } else {
          res.status(StatusCodes.NOT_FOUND).json({
            message: 'User not found',
          });
        }
      })
      .catch((error: Error) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
        console.error(error);
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

const getTransactions: RequestHandler = async (req, res) => {
  try {
    const { name, phone, token } = req.body as IUser;
    await UserModel.findOne({ phone })
      .then((user) => {
        if (user) {
          user
            .verifyAuthToken(token)
            .then(async (isMatch) => {
              if (isMatch) {
                await TransactionModel.find({
                  $or: [{ from: { name, phone } }, { to: { name, phone } }],
                })
                  .then((transactions) => {
                    res.status(StatusCodes.OK).json({
                      transactions,
                    });
                  })
                  .catch((error) => {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                      message: 'Something went wrong',
                    });
                    console.error(error);
                  });
              } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                  message: 'Invalid token',
                });
              }
            })
            .catch((error: Error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
              });
              console.error(error);
            });
        } else {
          res.status(StatusCodes.NOT_FOUND).json({
            message: 'User not found',
          });
        }
      })
      .catch((error: Error) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Something went wrong',
        });
        console.error(error);
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export { createTransaction, getTransactions };
