const prisma = require('@prisma/client');
const { PrismaClient } = prisma;
const { v4: uuidv4 } = require('uuid'); // Generate unique form IDs

const createForm = async (req, res) => {
    try {
        const { userId, title } = req.body;

        // Check if the user exists (optional validation)
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create the form
        const newForm = await prisma.form.create({
            data: {
                formId: uuidv4(), // Unique identifier for the form
                title: title,
                userId: userId, // Link form to the user
            },
        });

        res.status(201).json({ message: 'Form created successfully', form: newForm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};

const createSubmission = async (req, res) => {
    try {
        const { formId } = req.params;
        const formData = req.body;

        // Save the submission to the database
        const submission = await prisma.formSubmission.create({
            data: {
                formId: formId,
                data: formData,
            },
        });

        res.status(201).json({ message: 'Form submitted successfully', submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const { formId } = req.params;

        const submissions = await prisma.formSubmission.findMany({
            where: { formId: formId },
        });

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};


const getAll = async (req, res) => {
    try {
        const forms = await prisma.form.findMany();
        res.json(forms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};



module.exports = { createSubmission, getSubmissions, createForm, getAll };
