const passport = require('passport');

// Initiates Google OAuth2 login
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth2 callback and redirect
exports.googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login', // Redirect to login on failure
});

// Redirects to the dashboard after successful authentication
exports.redirectDashboard = (req, res) => {
    res.redirect('/dashboard');
};

// Logs the user out and redirects to the home page
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to destroy session' });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/');
        });
    });
};