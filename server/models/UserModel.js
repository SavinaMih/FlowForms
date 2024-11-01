const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming `db.js` exports a Sequelize instance

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'USERS' // Specify the table name if it differs from the model name
});

module.exports = User;
