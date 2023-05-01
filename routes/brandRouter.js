const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');

const {
  getBrands,
  newBrand,
  deleteBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  verifyBrand,
  searchBrands,
  getBrandsPaginated,
  blacklistBrand,
  getBrandByWalletAddress,
} = require('../controllers/brandController');

const brandRouter = express.Router();

brandRouter.get('/', asyncHandler(getBrands));
brandRouter.post('/', cookieAuthRequired(), asyncHandler(newBrand));
brandRouter.delete(
  '/',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(deleteBrands)
);

brandRouter.get('/:id', asyncHandler(getBrandById));
brandRouter.get('/user/:walletAddress', asyncHandler(getBrandByWalletAddress));
brandRouter.put('/:id', cookieAuthRequired(), asyncHandler(updateBrand));
brandRouter.delete(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(deleteBrand)
);
brandRouter.put(
  '/verify/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(verifyBrand)
);
brandRouter.put(
  '/blacklist/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(blacklistBrand)
);

brandRouter.get('/brands/search', asyncHandler(searchBrands));
brandRouter.get('/brands/paginated', asyncHandler(getBrandsPaginated));

module.exports = brandRouter;
