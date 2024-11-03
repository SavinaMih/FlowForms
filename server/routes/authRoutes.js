const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const flash = require('connect-flash');

const prisma = new PrismaClient();

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Render login page with Google as a provider
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Renders the login page
 */
router.get('/login', (req, res) => {
    res.render('login', { user: req.user, providers: ['google'], title: 'Login' });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Perform local login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Login failed
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ message: info.message || 'Login failed' });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            return res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    })(req, res, next);
});

/**
 * @swagger
 * /auth/signup:
 *   get:
 *     summary: Render signup page with Google as a provider
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Renders the signup page
 */
router.get('/signup', (req, res) => {
    res.render('signup', { providers: ['google'], title: 'Signup', user: req.user });
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirects to login on successful signup
 *       400:
 *         description: Signup failed due to existing user
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            req.flash('error', 'A user with this email already exists.');
            return res.redirect('/auth/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.redirect('/auth/signup');
    }
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to homepage on successful login
 *       400:
 *         description: Authentication failed
 */
router.get('/google/callback', async (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/auth/login');

        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        if (existingUser && !existingUser.googleId) {
            req.flash('error', 'This email is already associated with another account.');
            return res.redirect('/auth/login');
        }

        req.login(user, (err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to login after logout
 */
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You have been logged out.');
        res.redirect('/auth/login');
    });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check user authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns the authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [logged_in, not_logged_in]
 *                 user:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 */
router.get('/status', (req, res) => {
    console.log('Session:', req.session);
    if (req.isAuthenticated()) {
        res.json({
            status: 'logged_in',
            user: req.user
        });
    } else {
        res.json({
            status: 'not_logged_in'
        });
    }
});

module.exports = router;
