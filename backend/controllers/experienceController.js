const { Experience } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const data = await Experience.findAll({ order: [['display_order', 'ASC'], ['start_date', 'DESC']] });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const item = await Experience.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Experience.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Experience not found' });
    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const item = await Experience.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Experience not found' });
    await item.destroy();
    res.json({ success: true, message: 'Experience deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
