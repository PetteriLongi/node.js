import {
  addCat,
  findCatById,
  findCatsByUserId,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";

const getCat = async (req, res) => {
  const cats = await listAllCats();
  res.json(cats);
};

const getCatById = async (req, res, next) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    const error = new Error("Cat not found");
    error.status = 404;
    next(error);
    return;
  }
  res.json(cat);
};

const getCatsByUserId = async (req, res) => {
  const cats = await findCatsByUserId(req.params.userId);

  res.json(cats);
};

const postCat = async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);

  if (!req.file) {
    const error = new Error("Invalid or missing file");
    error.status = 400;
    next(error);
    return;
  }

  const result = await addCat({
    ...req.body,
    owner: res.locals.user.user_id,
    filename: req.file.filename,
  });
  if (result.cat_id) {
    res.status(201);
    res.json({ message: "New cat added.", result });
  } else {
    const error = new Error("Cat could not be created");
    error.status = 400;
    next(error);
  }
};

const putCat = async (req, res, next) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    const error = new Error("Cat not found");
    error.status = 404;
    next(error);
    return;
  }

  const { cat_name, weight, birthdate } = req.body;
  const result = await modifyCat(
    { cat_name, weight, birthdate },
    req.params.id,
    res.locals.user,
  );

  if (result) {
    res.json({ message: "Cat item updated.", result });
  } else {
    const error = new Error("Not authorized to update this cat");
    error.status = 403;
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    const error = new Error("Cat not found");
    error.status = 404;
    next(error);
    return;
  }

  const result = await removeCat(req.params.id, res.locals.user);
  if (result) {
    res.json(result);
  } else {
    const error = new Error("Not authorized to delete this cat");
    error.status = 403;
    next(error);
  }
};

export { getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat };
