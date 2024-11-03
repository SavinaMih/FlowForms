const express = require('express');
const { createSubmission, getSubmissions, createForm, getAll } = require('../controllers/FormController');
const router = express.Router();

/**
 * @swagger
 * /forms/{formId}:
 *   post:
 *     summary: Submit form data
 *     tags: [Form]
 *     description: Accepts form data and stores it in the database as JSON.
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier for the form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *       500:
 *         description: An error occurred
 */
router.post('/:formId', createSubmission);

/**
 * @swagger
 * /forms/{formId}:
 *   get:
 *     summary: Retrieve form submissions
 *     description: Retrieves all submissions for a specific form ID.
 *     tags: [Form]
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier for the form
 *     responses:
 *       200:
 *         description: Successful retrieval of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   formId:
 *                     type: string
 *                   data:
 *                     type: object
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: An error occurred
 */
router.get('/:formId', getSubmissions);


/**
 * @swagger
 * /forms:
 *   post:
 *     summary: Create a new form for a user
 *     description: Creates a new form and associates it with a specific user.
 *     tags: [Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user creating the form
 *               title:
 *                 type: string
 *                 description: The title of the form
 *     responses:
 *       201:
 *         description: Form created successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred
 */
router.post('/', createForm);


/**
 * @swagger
 * /forms:
 *   get:
 *     summary: Retrieve all forms
 *     description: Retrieves all forms from the database.
 *     tags: [Form]
 *     responses:
 *       200:
 *         description: Successful retrieval of forms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the form
 *                   formId:
 *                     type: string
 *                     description: Unique identifier for each form
 *                   name:
 *                     type: string
 *                     description: Title of the form
 *                   description:
 *                     type: string
 *                     description: Description of the form
 *                   userId:
 *                     type: integer
 *                     description: ID of the user who created the form
 *                   projectId:
 *                     type: integer
 *                     description: ID of the associated project
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Creation date of the form
 *       500:
 *         description: An error occurred while retrieving forms
 */
router.get('/', getAll);

module.exports = router;
