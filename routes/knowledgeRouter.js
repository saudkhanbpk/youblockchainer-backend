const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');

const {
  getKnowledges,
  getKnowledgeById,
  updateKnowledge,
  newKnowledge,
  deleteKnowledge,
} = require('../controllers/knowledgeController');

const knowledgeRouter = express.Router();

knowledgeRouter.get('/', asyncHandler(getKnowledges));
knowledgeRouter.post(
  '/',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(newKnowledge)
);

knowledgeRouter.get('/:id', asyncHandler(getKnowledgeById));
knowledgeRouter.put(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(updateKnowledge)
);
knowledgeRouter.delete(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(deleteKnowledge)
);

module.exports = knowledgeRouter;
