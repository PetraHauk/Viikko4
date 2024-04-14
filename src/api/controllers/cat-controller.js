import {
  addCat,
  checkCatAuthorization,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat
} from "../models/cat-model.js";
import bcrypt from "bcrypt";
import {validationResult} from "express-validator";

const getCat = async (req, res, next) => {
  res.json(await listAllCats());
  if (!res.json) {
    const error = new Error('No cats found');
    error.status = 404;
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    const error = new Error('Cat not found');
    error.status = 404;
    next(error);
  }
};

const postCat = async (req, res, next) => {
  //console.log('postCat', req.body);
  //console.log("file", req.file)

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
    return next(error)
  }

  let cat;
  if (currentUser.role === 'admin') {
    cat = req.body;
  } else {
    const {cat_name, weight, filename, birthdate} = req.body;
    cat = {cat_name, weight, owner: currentUser.user_id, filename, birthdate};
  }

  const result = await addCat(cat, req.file);
  if (!result) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }
  console.log(result);
  res.sendStatus(200);
};

const putCat = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.errors = errors.array();
    throw error;
  }

  const user = res.locals.user;
  const catID = req.params.id;
  const updateData = req.body;
  if (!user) {
    const error = new Error('Unauthorized: User not logged in');
    error.status = 401;
    return next(error);
  }

  if (user.role !== 'admin') {
    const isAuthorized = await checkCatAuthorization(catID, user);
    if (!isAuthorized) {
      const error = new Error('Unauthorized: User not authorized to modify this cat');
      error.status = 403;
      return next(error);
    }
  }

  const result =  await modifyCat(updateData, catID, user);
  if (!result) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }
  console.log(result);
  res.sendStatus(200);
};

const deleteCat = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const catID = req.params.id;
    if (!user) {
      const error = new Error('Unauthorized: User not logged in');
      error.status = 401;
      throw error;
    }

    if (user.role !== 'admin') {
      const isAuthorized = await checkCatAuthorization(catID, user);
      if (!isAuthorized) {
        const error = new Error('Unauthorized: User not authorized to delete this cat');
        error.status = 403;
        throw error;
      }
    }

    const result = await removeCat(catID, user);
    if (!result) {
      const error = new Error('Invalid or missing fields');
      error.status = 400;
      throw error;
    }
    console.log(result);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat};
