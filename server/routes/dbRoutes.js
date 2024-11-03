const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Import PrismaClient

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /db/status:
 *   get:
 *     summary: Check the database connection status
 *     tags:
 *       - Health Check
 *     description: Endpoint to verify if the database connection is successful.
 *     responses:
 *       200:
 *         description: Database connected successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Database connected successfully.
 *       500:
 *         description: Database connection failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Database connection failed.
 *                 error:
 *                   type: string
 *                   example: "Connection error details"
 */
router.get('/status', async (req, res) => {
    try {
        // Test the database connection
        await prisma.$connect();

        res.status(200).json({ status: "Database connected successfully." });
    } catch (error) {
        res.status(500).json({ status: "Database connection failed.", error: error.toString() });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
