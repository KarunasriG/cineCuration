const { curatedList } = require("../models");
const createCuratedLists = async (req, res) => {
  const { name, slug, description } = req.body;
  try {
    await curatedList.create({ name, slug, description });
    res.status(201).json({ message: "Curated list created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ "Error while creating curated list": error.message });
  }
};

const updateCuratedList = async (req, res) => {
  const { curatedListId } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const findCuratedList = await curatedList.findByPk(curatedListId);
    if (!findCuratedList) {
      return res.status(404).json({ error: "Curated list not found" });
    }
    await findCuratedList.update({ name, description });

    res.status(200).json({ message: "Curated list updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ "Error while updating curated list": error.message });
  }
};

module.exports = { createCuratedLists, updateCuratedList };
