const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  is_current: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responsibilities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  technologies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'experiences',
  underscored: true,
  timestamps: true,
});

module.exports = Experience;
