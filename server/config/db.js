// db.js
require('dotenv').config(); // Load environment variables from .env
const { Sequelize } = require('sequelize');

// Initialize Sequelize with DATABASE_URL from .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false, // Disable logging if preferred
});

// Sync models with the database (optional for development)
sequelize.sync({ alter: true }) // Use `alter: true` only in development
    .then(() => {
        console.log("Database synchronized successfully.");
    })
    .catch((error) => {
        console.error("Error synchronizing database:", error);
    });

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
