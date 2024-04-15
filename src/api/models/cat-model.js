// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_cats');
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_cats WHERE cats_id = ?', [id]);
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat, file) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;

  if (authUser.role === 'admin' || authUser.user_id === owner) {
    const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
    const params = [cat_name, weight, owner, filename, birthdate];
    const rows = await promisePool.execute(sql, params);
    console.log('rows', rows);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return {cat_id: rows[0].insertId};
  } else {
    throw new Error('Unauthorized');
  }
};

const modifyCat = async (cat, id, authUser) => {
  if (authUser.role === 'admin' || authUser.user_id === cat.owner) {
    const sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [cat, id]);
    const rows = await promisePool.execute(sql);
    console.log('rows', rows);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  }
};

const removeCat = async (id, authUser) => {
  if (authUser.role === 'admin' || authUser.user_id === id) {
    const [rows] = await promisePool.execute('DELETE FROM wsk_cats WHERE cat_id = ?', [id]);
    console.log('rows', rows);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  }
};

const checkCatAuthorization = async (cat_id, user) => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_cats WHERE cat_id = ?', [cat_id]);
  if (rows.length === 0) {
    return false;
  }
  if (rows[0].owner !== user.user_id) {
    return false;
  }
  return true;
};

export {listAllCats, findCatById, addCat, modifyCat, removeCat, checkCatAuthorization};
