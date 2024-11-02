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
                    password: userData.password, // Password should be hashed before storing
                    googleId: userData.googleId || null, // Optional Google ID
                },
            });
            return user;
        } catch (error) {
            // Handle unique constraint error on email field
            if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
                console.error('Email already exists.');
                throw new Error('Email already exists.');
            } else {
                console.error('Error creating user:', error);
                throw error;
            }
        }
    }

    // Find a user by email
    static async findUserByEmail(email) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            return user;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
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


