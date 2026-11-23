const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'portfolio_db';

// Ensure the database exists before Sequelize initializes
const initializeDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();
  } catch (error) {
    console.error('Error pre-initializing MySQL database:', error.message);
  }
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false, // Set to console.log to debug SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

const connectDB = async () => {
  await initializeDatabase();
  try {
    await sequelize.authenticate();
    console.log(`[MySQL] Connected successfully to database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}`);
  } catch (error) {
    console.error('[MySQL] Connection failure:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
