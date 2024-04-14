import bcrypt from 'bcrypt';
import {validationResult} from "express-validator";
import {addUser, findUserById, listAllUsers, findCatsByUserId, modifyUser, removeUser} from "../models/user-model.js";

const getUser = async (req, res, next) => {
  res.json(await listAllUsers());
  if (!res.json) {
    const error = new Error('No users found');
    error.status = 404;
    next(error);
  }
}

const getUserById = async (req, res, next) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    const error = new Error('User not found');
    error.status = 404;
    next(error);
  }
}

const getUserCats = async (req, res) => {
  const cats = await findCatsByUserId(req.params.id);
  if (cats) {
    res.json(cats);
  } else {
    const error = new Error('No cats found for this user');
    error.status = 404;
    next(error);
  }
}

const postUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }

  const currentUser = res.locals.user;
  if (!currentUser) {
    const error = new Error('Unauthorized: User not logged in');
    error.status = 401;
    return next(error);
  }

  let user;
  if (currentUser.role === 'admin') {
    const {name, username, email, role, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    user = {name, username, email, role, password: hashedPassword};
  } else {
    const {name, username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    user = {name, username, email, role: 'user', password: hashedPassword};
  }
  const result = await addUser(user);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    next(error);
  }
}

const putUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }

  const userID = res.params.id;
  const updateData = req.body;
  const authUser = res.locals.user;

  if (!authUser) {
    const error = new Error('Unauthorized: User not logged in');
    error.status = 401;
    return next(error);
  }

  if (authUser.user.id !== userID && authUser.role !== 'admin') {
    const error = new Error('Unauthorized: User not authorized to modify this user');
    error.status = 403;
    return next(error);
  }

  const result = await modifyUser(updateData, userID, authUser);
  if (!result) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }

  console.log(result);
  res.sendStatus(200);
}

const deleteUser = async (req, res, next) => {
  try {
    const userID = res.params.id;
    const authUser = res.locals.user;
    if (!authUser) {
      const error = new Error('Unauthorized: User not logged in');
      error.status = 401;
      throw error;
    }
    if (authUser.user.id === userID || authUser.role === 'admin') {
      const result = await removeUser(userID, authUser);
      if (!result) {
        const error = new Error('Invalid or missing fields');
        error.status = 400;
        throw error;
      }
      res.status(200);
      return;
    }
    const error = new Error('Unauthorized: User not authorized to delete this user');
    error.status = 403;
    throw error;
  } catch (error) {
    next(error);
  }
}

export {getUser, getUserById, getUserCats, postUser, putUser, deleteUser};
