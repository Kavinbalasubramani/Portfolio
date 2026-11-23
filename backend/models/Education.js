const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  degree: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  start_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  end_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cgpa: {
    type: DataTypes.DECIMAL(4, 3),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'education',
  underscored: true,
  timestamps: true,
});

module.exports = Education;
