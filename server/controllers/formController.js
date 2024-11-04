const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new Form
exports.createForm = async (req, res) => {
    try {
        const { title, description, projectId } = req.body;
        const userId = req.userId; // Assuming userId is set by the authentication middleware

        // Check if the project exists and if the user has access to it
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { users: true }, // Fetch associated users to verify ownership
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the current user is associated with the project
        const isUserAuthorized = project.users.some(user => user.id === userId);
        if (!isUserAuthorized) {
            return res.status(403).json({ error: 'User not authorized to create a form for this project' });
        }

        // Check if the project already has an associated form
        const existingForm = await prisma.form.findFirst({
            where: {
                project: {
                    id: projectId,
                },
            },
        });

        if (existingForm) {
            return res.status(400).json({ error: 'This project already has a form associated with it.' });
        }

        // Create the form and associate it with the project and user
        const form = await prisma.form.create({
            data: {
                title,
                description,
                project: {
                    connect: { id: projectId },
                },
                user: { connect: { id: userId } },
            },
        });

        res.status(201).json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Forms for the current user
exports.getAllForms = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set by the authentication middleware

        const forms = await prisma.form.findMany({
            where: {
                userId: userId,
            },
            include: {
                project: true,
            },
        });

        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Form by ID for the current user
exports.getFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const form = await prisma.form.findUnique({
            where: { id: parseInt(id) },
            include: {
                project: true,
                user: true,
            },
        });

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Check if the form belongs to the current user
        if (form.userId !== userId) {
            return res.status(403).json({ error: 'User not authorized to access this form' });
        }

        res.json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Form if it belongs to the current user
exports.updateForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.userId;

        // Fetch the form to check ownership
        const form = await prisma.form.findUnique({
            where: { id: parseInt(id) },
        });

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Check if the form belongs to the current user
        if (form.userId !== userId) {
            return res.status(403).json({ error: 'User not authorized to update this form' });
        }

        // Update the form
        const updatedForm = await prisma.form.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
            },
        });

        res.json(updatedForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Form if it belongs to the current user
exports.deleteForm = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Fetch the form to check ownership
        const form = await prisma.form.findUnique({
            where: { id: parseInt(id) },
        });

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Check if the form belongs to the current user
        if (form.userId !== userId) {
            return res.status(403).json({ error: 'User not authorized to delete this form' });
        }

        // Delete the form
        await prisma.form.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
