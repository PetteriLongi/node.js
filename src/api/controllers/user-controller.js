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

const getUserById = async (req, res, next) => {
  const user = await findUserById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    const error = new Error("User not found");
    error.status = 404;
    next(error);
  }
};

const postUser = async (req, res, next) => {
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
    const error = new Error("User could not be created");
    error.status = 400;
    next(error);
  }
};

const putUser = async (req, res, next) => {
  if (
    Number(req.params.id) !== res.locals.user.user_id &&
    res.locals.user.role !== "admin"
  ) {
    const error = new Error("Not authorized to update this user");
    error.status = 403;
    next(error);
    return;
  }

  const { name, username, email } = req.body;
  const result = await modifyUser({ name, username, email }, req.params.id);

  if (result) {
    res.json(result);
  } else {
    const error = new Error("User not found");
    error.status = 404;
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (
    Number(req.params.id) !== res.locals.user.user_id &&
    res.locals.user.role !== "admin"
  ) {
    const error = new Error("Not authorized to delete this user");
    error.status = 403;
    next(error);
    return;
  }
  const result = await removeUser(req.params.id);

  if (result) {
    res.json(result);
  } else {
    const error = new Error("User not found");
    error.status = 404;
    next(error);
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser };
