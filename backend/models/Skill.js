const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  category: {
    // lowercase to match seed data
    type: DataTypes.ENUM('frontend', 'backend', 'database', 'tools', 'other'),
    allowNull: false,
    defaultValue: 'frontend',
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    validate: { min: 1, max: 3 },
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'skills',
  underscored: true,
  timestamps: true,
});

module.exports = Skill;
