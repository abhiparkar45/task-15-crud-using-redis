const client = require("../redisConfig");

exports.getCategory = async (req, res, next) => {
  const categories = await client.hGetAll(`Category`);
  return res.status(200).json({ success: true, data: categories });
};
exports.createCategory = async (req, res, next) => {
  const body = await req.body;
  const categoryName = body.categoryName;
  const exist = await client.exists(`Category`);
  if (!exist) {
    const category = await client.hSet(`Category`, `0`, categoryName);
    if (category) {
      const category = await client.hGet(`Category`, `0`);
      return res.status(201).json({ success: true, data: category });
    }
  } else {
    let alreadyInDB;
    const categoryLength = await client.hLen("Category");
    for (let i = 0; i <= categoryLength; i++) {
      const value = await client.hGet(`Category`, `${i}`);
      if (value === categoryName) {
        alreadyInDB = true;
        break;
      }
    }
    if (alreadyInDB) {
      return res
        .status(400)
        .json({ success: false, message: "Already in Redis !" });
    }

    let availableID;
    for (let i = 0; i <= categoryLength; i++) {
      const notEmpty = await client.hExists(`Category`, `${i}`);
      if (!notEmpty) {
        availableID = i;
        break;
      }
    }
    const category = await client.hSet(
      `Category`,
      `${availableID}`,
      `${categoryName}`
    );
    if (category) {
      const category = await client.hGet(`Category`, `${availableID}`);
      return res.status(201).json({ success: true, data: category });
    }
  }
};
exports.updateCategory = async (req, res, next) => {
  const categoryId = await req.params.id;
  const categoryName = await req.body.categoryName;
  const exist = await client.hExists(`Category`, `${categoryId}`);
  if (!exist) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found !" });
  }
  const categoryLength = await client.hLen("Category");
  let alreadyInDB;
  for (let i = 0; i <= categoryLength; i++) {
    const value = await client.hGet(`Category`, `${i}`);
    if (value === categoryName) {
      alreadyInDB = true;
      break;
    }
  }
  if (alreadyInDB) {
    return res
      .status(400)
      .json({ success: false, message: "Already in Redis !" });
  }

  const updateSuccess = await client.hSet(
    `Category`,
    `${categoryId}`,
    `${categoryName}`
  );

  if (updateSuccess === 0) {
    const updated = await client.hGet(`Category`, `${categoryId}`);
    return res.status(200).json({ success: true, data: updated });
  }
};
exports.deleteCategory = async (req, res, next) => {
  const categoryId = await req.params.id;
  const exist = await client.hExists(`Category`, `${categoryId}`);
  if (!exist) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found !" });
  }
  const deletedSuccess = await client.hDel(`Category`, `${categoryId}`);
  if (deletedSuccess) {
    return res
      .status(200)
      .json({ success: true, message: "Category Deleted successfully !" });
  }
};
