import {addUser, findUserById, listAllUsers, modifyUser, removeUser} from "../models/user-model.js";

const getUser = (req, res) => {
  res.json(listAllUsers());
}

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
}

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
}

const putUser = (req, res) => {
  const result = modifyUser(req.body, req.params.id);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  console.log(result);
  res.sendStatus(200);
}

const deleteUser = (req, res) => {
  const result = removeUser(req.params.id);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  console.log(result);
  res.sendStatus(200);
}

export {getUser, getUserById, postUser, putUser, deleteUser};
