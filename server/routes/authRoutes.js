const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const UserService = require('../services/UserService'); // Adjust path if needed

// Render login page with Google as a provider
router.get('/login', (req, res) => {
    res.render('login', { providers: ['google'] });
});

// Local login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Render signup page with Google as a provider
router.get('/signup', (req, res) => {
    res.render('signup', { providers: ['google'] });
});

// Signup route with duplicate check
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the given email already exists
        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'A user with this email already exists.');
            return res.redirect('/auth/signup');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await UserService.createUser({
            name,
            email,
            password: hashedPassword
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.redirect('/auth/signup');
    }
});

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route with duplicate check
router.get('/google/callback', async (req, res, next) => {
    passport.authenticate('google', async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/auth/login');

        // Check if a user with the same email already exists
        const existingUser = await UserService.findUserByEmail(user.email);
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

module.exports = router;
