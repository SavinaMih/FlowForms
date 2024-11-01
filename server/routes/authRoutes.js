const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiates Google OAuth2 login
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/google', authController.googleAuth);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     responses:
 *       302:
 *         description: Redirects to the dashboard upon successful login
 */
router.get('/google/callback', authController.googleAuthCallback, authController.redirectDashboard);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logs the user out
 *     responses:
 *       302:
 *         description: Redirects to the home page after logout
 */
router.get('/logout', authController.logout);

module.exports = router;
