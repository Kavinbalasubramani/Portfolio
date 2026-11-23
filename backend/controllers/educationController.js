const { Education } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const data = await Education.findAll({ order: [['display_order', 'ASC'], ['start_year', 'DESC']] });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const item = await Education.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Education.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Education not found' });
    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const item = await Education.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Education not found' });
    await item.destroy();
    res.json({ success: true, message: 'Education deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
