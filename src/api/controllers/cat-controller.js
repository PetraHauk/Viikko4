import {
  addCat,
  checkCatAuthorization,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat
} from "../models/cat-model.js";
import bcrypt from "bcrypt";

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  //console.log('postCat', req.body);
  //console.log("file", req.file)
  const currentUser = res.locals.user;
  if(!currentUser) {
    res.sendStatus(401);
    return;
  }
  let cat;
  if (currentUser.role === 'admin') {
    cat = req.body;
  } else {
    const {cat_name, weight, filename, birthdate} = req.body;
    cat = {cat_name, weight, owner: currentUser.user_id, filename, birthdate};
  }
  const result = await addCat(cat, req.file);
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const user = res.locals.user;
  const catID = req.params.id;
  const updateData = req.body;
  if (!user) {
    res.sendStatus(401);
    return;
  }

  if (user.role !== 'admin') {
    const isAuthorized = await checkCatAuthorization(catID, user);
    if (!isAuthorized) {
      res.sendStatus(403);
      return;
    }
  }

  const result =  await modifyCat(updateData, catID, user);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  console.log(result);
  res.sendStatus(200);
};

const deleteCat = async (req, res) => {
  const user = res.locals.user;
  const catID = req.params.id;
  if (!user) {
    res.sendStatus(401);
    return;
  }

  if (user.role !== 'admin') {
    const isAuthorized = await checkCatAuthorization(catID, user);
    if (!isAuthorized) {
      res.sendStatus(403);
      return;
    }
  }

  const result = await removeCat(catID, user);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  console.log(result);
  res.sendStatus(200);
};

export {getCat, getCatById, postCat, putCat, deleteCat};
