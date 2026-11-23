const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  full_description: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  technologies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  github_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  live_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'projects',
  underscored: true,
  timestamps: true,
});

module.exports = Project;
