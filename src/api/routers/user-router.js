import express from "express";
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser, getUserCats,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.route("/").get(getUser).post(postUser);

userRouter.route("/:id").get(getUserById).put(putUser).delete(deleteUser);

userRouter.route("/:id/cats").get(getUserCats);

export default userRouter;
