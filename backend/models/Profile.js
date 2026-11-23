const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Kavin B',
  },
  brand_logo: {
    type: DataTypes.STRING(24),
    allowNull: true,
    defaultValue: '',
  },
  brand_logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '',
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    defaultValue: 'Full Stack Developer',
  },
  animated_roles: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    defaultValue: 'Full Stack Developer\nLaravel Developer\nReact Developer\nBackend Developer',
  },
  hero_tagline: {
    type: DataTypes.STRING(200),
    allowNull: true,
    defaultValue: 'Available for new opportunities',
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    defaultValue: 'kavinkbs2202@gmail.com',
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '+91 90258 63438',
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Tamil Nadu, India',
  },
  github_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '',
  },
  linkedin_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '',
  },
  resume_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '',
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 2,
  },
  projects_completed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 15,
  },
  clients_served: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'profiles',
  underscored: true,
  timestamps: true,
});

module.exports = Profile;
