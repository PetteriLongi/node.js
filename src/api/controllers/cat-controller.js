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

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const getCatsByUserId = async (req, res) => {
  const cats = await findCatsByUserId(req.params.userId);

  res.json(cats);
};

const postCat = async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const result = await addCat({
    ...req.body,
    owner: res.locals.user.user_id,
    filename: req.file.filename,
  });
  if (result.cat_id) {
    res.status(201);
    res.json({ message: "New cat added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    res.sendStatus(404);
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
    res.sendStatus(403);
  }
};

const deleteCat = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    res.sendStatus(404);
    return;
  }

  const result = await removeCat(req.params.id, res.locals.user);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(403);
  }
};

export { getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat };
