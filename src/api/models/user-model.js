import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM users');
  return rows;
}

const findUserById = async (id) => {
  const [rows] = await promisePool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}

const getUserByUsername = async (username) => {
  const sql = `SELECT *
              FROM wsk_users
              WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [username]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findCatsByUserId = async (id) => {
  const [rows] = await promisePool.execute('SELECT * FROM cats WHERE owner = ?', [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows;
}

const addUser = async (user) => {
  const {name, username, email, role, password} = user;
  const sql = `INSERT INTO users (name, username, email, role, password)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, role, password];
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {user_id: rows[0].insertId};
}

const modifyUser = async (user, id, authUser) => {
  if (authUser.role === 'admin' && authUser.user_id !== id) {
    const sql = promisePool.format(`UPDATE users SET ? WHERE user_id = ?`, [user, id]);
    const rows = await promisePool.execute(sql);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return {message: 'User item updated.'};
  }
}

const removeUser = async (id, authtUser) => {
  if (authtUser.role === 'admin' && authtUser.user_id !== id) {
    const [userRows] = await promisePool.execute('DELETE FROM users WHERE user_id = ?', [id]);
    if (userRows.affectedRows === 0) {
      return false;
    }
    const [catRows] = await promisePool.execute('DELETE FROM cart WHERE user_id = ?', [id]);
    return {message: 'User item deleted.'};
  } else {
    return 'Unauthorized';
  }
}

export {listAllUsers, findUserById, getUserByUsername, findCatsByUserId, addUser, modifyUser, removeUser};
