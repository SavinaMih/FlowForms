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
        if (err) { return next(err); }
        res.redirect('/');
    });
};
