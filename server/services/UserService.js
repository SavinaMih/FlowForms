// services/UserService.js
const User = require('../models/UserModel');

class UserService {
    static async createUser(userData) {
        try {
            const user = await User.create({
                name: userData.name,
                email: userData.email,
                password: userData.password, // Consider hashing the password before storing
            });
            return user;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.error('Email already exists.');
                throw new Error('Email already exists.');
            } else {
                console.error('Error creating user:', error);
                throw error;
            }
        }
    }


    static async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            return user;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }

    static async updateUser(userId, updatedData) {
        try {
            const [updatedRowCount] = await User.update(updatedData, {
                where: { id: userId }
            });
            return updatedRowCount > 0;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            const deletedRowCount = await User.destroy({
                where: { id: userId }
            });
            return deletedRowCount > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }
}

module.exports = UserService;
