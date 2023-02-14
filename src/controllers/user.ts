import { RequestHandler } from 'express';
import { IUser, UserModel } from '../models/user';
import { StatusCodes } from 'http-status-codes';

const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, pin } = req.body as IUser;

    await UserModel.findOne({ email })
      .then(async (user) => {
        if (user) {
          res.status(StatusCodes.CONFLICT).json({
            message: 'User already exists',
          });
        } else {
          const user = new UserModel({
            name,
            email,
            phone,
          });
          user.encryptPin(pin);
          await user
            .save()
            .then((user) => {
              res.status(StatusCodes.CREATED).json({
                message: 'User created successfully',
              });
            })
            .catch((error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
              });
              console.error(error);
            });
        }
      })
      .catch((error) => {
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

const getUser: RequestHandler = async (req, res) => {
  try {
    const { email, pin } = req.body as IUser;

    await UserModel.findOne({ email })
      .then((user) => {
        if (user) {
          user
            .comparePin(pin)
            .then((isMatch) => {
              if (isMatch) {
                user.generateAuthToken();
                res.status(StatusCodes.OK).json({
                  message: 'User found',
                  user,
                });
              } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                  message: 'Incorrect pin',
                });
              }
            })
            .catch((error) => {
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
      .catch((error) => {
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

const updateUser: RequestHandler = async (req, res) => {
  try {
    const { email, pin, name, phone, oldPin } = req.body as IUser;

    await UserModel.findOne({ email }).then((user) => {
      if (user) {
        user.comparePin(oldPin as string).then((isMatch) => {
          if (isMatch) {
            user.name = name;
            user.phone = phone || '';
            user.encryptPin(pin);
            res.status(StatusCodes.OK).json({
              message: 'User updated successfully',
              user,
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect pin',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'User not found',
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { email, pin } = req.body as IUser;

    UserModel.findOne({ email }).then((user) => {
      if (user) {
        user.comparePin(pin).then((isMatch) => {
          if (isMatch) {
            user.deleteOne();
            res.status(StatusCodes.OK).json({
              message: 'User deleted successfully',
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect pin',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'User not found',
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

const resumeSession: RequestHandler = async (req, res) => {
  try {
    const { email, token } = req.body as IUser;

    UserModel.findOne({ email }).then((user) => {
      if (user) {
        user.verifyAuthToken(token).then((isMatch) => {
          if (isMatch) {
            res.status(StatusCodes.OK).json({
              message: 'Session resumed',
              user,
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: 'Incorrect token',
            });
          }
        });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'User not found',
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
    console.error(error);
  }
};

export { createUser, getUser, updateUser };
