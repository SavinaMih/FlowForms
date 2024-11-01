// services/UserService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserService {
    // Create a new user
    static async createUser(userData) {
        try {
            const user = await prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password, // Consider hashing the password before storing
                },
            });
            return user;
        } catch (error) {
            if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
                console.error('Email already exists.');
                throw new Error('Email already exists.');
            } else {
                console.error('Error creating user:', error);
                throw error;
            }
        }
    }

    // Get user by ID
    static async getUserById(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            return user;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    }

    // Update user information
    static async updateUser(userId, updatedData) {
        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: updatedData,
            });
            return user;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete a user
    static async deleteUser(userId) {
        try {
            await prisma.user.delete({
                where: { id: userId },
            });
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Get all users
    static async getAllUsers() {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }
}

module.exports = UserService;

