const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const flash = require('connect-flash');

const prisma = new PrismaClient();

// Render login page with Google as a provider
router.get('/login', (req, res) => {
    res.render('login', { user: req.user, providers: ['google'], title: 'Login' });
});

// Local login route
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

// Render signup page with Google as a provider
router.get('/signup', (req, res) => {
    res.render('signup', { providers: ['google'], title: 'Signup', user: req.user });
});

// Signup route with duplicate check using Prisma
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the given email already exists in Prisma
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            req.flash('error', 'A user with this email already exists.');
            return res.redirect('/auth/signup');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in Prisma
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

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route with duplicate check using Prisma
router.get('/google/callback', async (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/auth/login');

        // Check if a user with the same email already exists in Prisma
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        if (existingUser && !existingUser.googleId) {
            req.flash('error', 'This email is already associated with another account.');
            return res.redirect('/auth/login');
        }

        // If user is new, proceed with authentication
        req.login(user, (err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You have been logged out.');
        res.redirect('/auth/login');
    });
});

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
