const express = require('express');
const passport = require('../config/passport'); // Path to your passport configuration

const router = express.Router();

// Google OAuth authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect or respond as desired
        res.redirect('/');
    }
);

// Local signup
router.post('/signup', async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword });

        // Log in the user
        req.login(user, (err) => {
            if (err) return next(err);
            res.status(201).json({ message: 'User created successfully', user });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Local login
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

module.exports = router;


