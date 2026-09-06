import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from "../models/user-model.js";
import bcrypt from "bcrypt";

const getUser = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    name,
    username,
    email,
    password: hashedPassword,
    role: "user",
  };
  const result = await addUser(user);

  if (result.user_id) {
    res.status(201);
    res.json({ message: "New user added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  if (
    Number(req.params.id) !== res.locals.user.user_id &&
    res.locals.user.role !== "admin"
  ) {
    res.sendStatus(403);
    return;
  }

  const { name, username, email } = req.body;
  const result = await modifyUser({ name, username, email }, req.params.id);

  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
};

const deleteUser = async (req, res) => {
  if (
    Number(req.params.id) !== res.locals.user.user_id &&
    res.locals.user.role !== "admin"
  ) {
    res.sendStatus(403);
    return;
  }
  const result = await removeUser(req.params.id);

  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser };
