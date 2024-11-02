const UserService = require('../services/userService');

// Controller for creating a new user
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        console.log('Attempting to create user with data:', userData); // Log input data

        const user = await UserService.createUser(userData);
        console.log('User created successfully:', user); // Log the created user

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error); // Log the error stack for details
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }

};

// Controller for getting a user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
// Controller for updating a user by ID
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updated = await UserService.updateUser(userId, updatedData);
        if (updated) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Controller for deleting a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await UserService.deleteUser(userId);
        if (deleted) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Export controllers
module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
};
