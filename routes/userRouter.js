const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');

const {
  getUsers,
  getUserById,
  toggleFollow,
  getUsersPaginated,
  getVerifiedCreators,
  searchUsers,
  updateProfile,
  getUserByWalletAddress,
  verifyCreator,
  login,
  getMe,
  getNonVerifiedCreators,
  newAgreement,
  updateAgreement,
  getUserAgreements,
  executeMetaTransaction
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/login', asyncHandler(login));

userRouter.get('/users/search', asyncHandler(searchUsers));
userRouter.get('/users', asyncHandler(getUsers));
userRouter.get(
  '/verified',
  asyncHandler(getVerifiedCreators)
);
userRouter.get(
  '/pending',
  asyncHandler(getNonVerifiedCreators)
);
userRouter.get('/users/paginated', asyncHandler(getUsersPaginated));

userRouter.get('/users/:walletAddress', asyncHandler(getUserByWalletAddress));
userRouter.get('/users/:id', asyncHandler(getUserById));
userRouter.get('/me', cookieAuthRequired(), asyncHandler(getMe));
userRouter.put('/me', cookieAuthRequired(), asyncHandler(updateProfile));

userRouter.put(
  '/toggleFollow/:id',
  cookieAuthRequired(),
  asyncHandler(toggleFollow)
);

userRouter.put(
  '/verify/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(verifyCreator)
);

userRouter.get('/agreements/:user_id', cookieAuthRequired(), asyncHandler(getUserAgreements));
userRouter.post('/agreement', cookieAuthRequired(), asyncHandler(newAgreement));
userRouter.put('/agreement/:id', cookieAuthRequired(), asyncHandler(updateAgreement));

userRouter.post('/metatx', cookieAuthRequired(), asyncHandler(executeMetaTransaction));

module.exports = userRouter;
