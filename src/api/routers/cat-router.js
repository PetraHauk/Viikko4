import express from 'express';
import {body} from "express-validator";
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
import {upload, authenticateToken,validationErrors} from '../../middlewares.js'

const catRouter = express.Router();

const validateCat = [
  body('cat_name').trim().isLength({ min: 1 }).withMessage('Cat name must be at least 3 characters long'),
  body('weight').trim().isNumeric().withMessage('Weight must be a number'),
  body('birthdate').isISO8601().withMessage('Invalid birthdate format'),
];

catRouter
  .route('/')
  .get(getCat)
  .post(
    authenticateToken,
    validateCat,
    validationErrors,
    upload.single('file'),
    postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(
    validateCat,
    validationErrors,
    putCat)
  .delete(deleteCat);

export default catRouter;
