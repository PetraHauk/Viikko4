const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3602,
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jan@metropolia.fi',
    role: 'user',
    password: 'password123',
  }
];

const listAllUsers = () => {
  return userItems;
}

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
}

const addUser = (user) => {
  const {name, username, email, role, password} = user;
  const newId = userItems[0].user_id + 1;
  userItems.unshift({user_id: newId, name, username, email, role, password});
  return {user_id: newId};
}

const modifyUser = (user, id) => {
  const index = userItems.findIndex((item) => item.user_id == id);
  if (index !== -1) {
    userItems[index] = {...user, user_id: id};
    return {message: 'User item updated.'};
  }
  return null;
}

const removeUser = (id) => {
  const index = userItems.findIndex((item) => item.user_id == id);
  if (index !== -1) {
    userItems.splice(index, 1);
    return {message: 'User item deleted.'};
  }
  return false;
}

export {listAllUsers, findUserById, addUser, modifyUser, removeUser};
