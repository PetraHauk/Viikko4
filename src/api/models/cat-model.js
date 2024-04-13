// mock data
const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Frank',
    weight: 11,
    owner: 3609,
    filename: 'f3dbafakjsdfhg4',
    birthdate: '2021-10-12',
  },
  {
    cat_id: 9590,
    cat_name: 'Mittens',
    weight: 8,
    owner: 3602,
    filename: 'f3dasdfkjsdfhgasdf',
    birthdate: '2021-10-12',
  },
];

const listAllCats = () => {
  return catItems;
};

const findCatById = (id) => {
  return catItems.find((item) => item.cat_id == id);
};

const addCat = (cat, file) => {
  const {cat_name, weight, owner, birthdate} = cat;
  const newId = catItems[0].cat_id + 1;
  catItems.unshift({cat_id: newId, cat_name, weight, owner, filename: file.filename, filepath: file.filename, birthdate});
  return {cat_id: newId};
};

const modifyCat = (cat, id) => {
  const index = catItems.findIndex((item) => item.cat_id == id);
  if (index !== -1) {
    catItems[index] = {...cat, cat_id: id};
    return {message: 'Cat item updated.'};
  }
  return null;
}

const removeCat = (id) => {
  const index = catItems.findIndex((item) => item.cat_id == id);
  if (index !== -1) {
    catItems.splice(index, 1);
    return {message: 'Cat item deleted.'};
  }
  return false;
}

export {listAllCats, findCatById, addCat, modifyCat, removeCat};
