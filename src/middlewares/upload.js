import sharp from "sharp";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file.path);

  const thumbnailPath = req.file.path + "_thumb";
  await sharp(req.file.path).resize(160, 160).png().toFile(thumbnailPath);

  next();
};

export { createThumbnail };
