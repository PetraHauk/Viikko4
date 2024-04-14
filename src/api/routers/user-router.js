import express from "express";
import {body} from 'express-validator';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser, getUserCats,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

const validateUser = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').escape(),
];

userRouter.route('/')
  .get(getUsers)
  .post(
    validateUser,
    validationErrors,
    postUser
  );

userRouter.route("/:id")
  .get(getUserById)
  .put(validateUser,
    validationErrors,
    putUser)
  .delete(deleteUser);

userRouter.route("/:id/cats").get(getUserCats);

export default userRouter;
