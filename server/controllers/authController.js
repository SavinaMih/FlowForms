const passport = require('../config/passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' });

exports.redirectDashboard = (req, res) => {
    res.redirect(process.env.CLIENT_ORIGIN + '/dashboard');
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect(process.env.CLIENT_ORIGIN || '/');
    });
};
