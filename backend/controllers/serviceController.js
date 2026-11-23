const { Service } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const data = await Service.findAll({ order: [['display_order', 'ASC']] });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const item = await Service.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Service.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Service not found' });
    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const item = await Service.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Service not found' });
    await item.destroy();
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
