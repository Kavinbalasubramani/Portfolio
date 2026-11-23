const { Skill } = require('../models');

// @desc  Get all skills
// @route GET /api/skills
// @access Public
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.findAll({ order: [['display_order', 'ASC'], ['category', 'ASC']] });
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
};

// @desc  Create skill
// @route POST /api/skills
// @access Private
const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// @desc  Update skill
// @route PUT /api/skills/:id
// @access Private
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    await skill.update(req.body);
    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete skill
// @route DELETE /api/skills/:id
// @access Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    await skill.destroy();
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
