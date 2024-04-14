import bcrypt from 'bcrypt';
import {addUser, findUserById, listAllUsers, findCatsByUserId, modifyUser, removeUser} from "../models/user-model.js";

const getUser = async (req, res) => {
  res.json(await listAllUsers());
}

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
}

const getUserCats = async (req, res) => {
  const cats = await findCatsByUserId(req.params.id);
  if (cats) {
    res.json(cats);
  } else {
    res.sendStatus(404);
  }
}

const postUser = async (req, res) => {
  const currentUser = res.locals.user;
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  try {
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
      return;
    }
  } catch (error) {
    console.error('Error adding user', error);
    res.sendStatus(500);
  }
}

const putUser = async (req, res) => {
  const userID = res.params.id;
  const updateData = req.body;
  const authUser = res.locals.user;
  if (!authUser) {
    res.sendStatus(401);
    return;
  }

  try {
    if (authUser.user.id !== userID && authUser.role !== 'admin') {
    const result = await modifyUser(updateData, userID, authUser);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    console.log(result);
    res.sendStatus(200);
    return;
    }
    res.sendStatus(403);
  } catch (error) {
    console.error('Error updating user', error);
    res.sendStatus(500);
  }
}

const deleteUser = async (req, res) => {
  const userID = res.params.id;
  const authUser = res.locals.user;
  if (!authUser) {
    res.sendStatus(401);
    return;
  }
  try {
    if (authUser.user.id === userID || authUser.role === 'admin') {
      const result = await removeUser(userID, authUser);
      if (!result) {
        res.sendStatus(400);
        return;
      }
      res.status(200);
      return;
    }
    res.sendStatus(403);
  } catch (error) {
    console.error('Error deleting user', error);
    res.sendStatus(500);
  }
}

export {getUser, getUserById, getUserCats, postUser, putUser, deleteUser};
