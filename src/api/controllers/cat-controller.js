import {addCat, findCatById, listAllCats, modifyCat, removeCat} from "../models/cat-model.js";

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  const result = modifyCat(req.body, req.params.id, res.locals.user);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  console.log(result);
  res.sendStatus(200);
};

const deleteCat = (req, res) => {
  const result = removeCat(req.params.id, res.locals.user);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  console.log(result);
  res.sendStatus(200);
};

export {getCat, getCatById, postCat, putCat, deleteCat};
