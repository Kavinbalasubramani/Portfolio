const { Op } = require('sequelize');
const { Project } = require('../models');

// @desc  Get all projects (public – optionally filter featured)
// @route GET /api/projects
// @access Public
const getProjects = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.featured === 'true') where.is_featured = true;

    const projects = await Project.findAll({
      where,
      order: [['display_order', 'ASC'], ['created_at', 'DESC']],
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single project by id or slug
// @route GET /api/projects/:id
// @access Public
const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const where = isNaN(Number(id)) ? { slug: id } : { id: Number(id) };
    const project = await Project.findOne({ where });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc  Create project
// @route POST /api/projects
// @access Private
const createProject = async (req, res, next) => {
  try {
    if (req.file) req.body.thumbnail_url = `/uploads/${req.file.filename}`;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc  Update project
// @route PUT /api/projects/:id
// @access Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (req.file) req.body.thumbnail_url = `/uploads/${req.file.filename}`;
    await project.update(req.body);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete project
// @route DELETE /api/projects/:id
// @access Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    await project.destroy();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
