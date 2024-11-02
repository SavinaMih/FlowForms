const authRoutes = require('./authRoutes');
const userRoutes = require('./userRouters');
const dbRoutes = require('./dbRoutes');
const { swaggerUi, specs } = require('../swagger'); // Import Swagger configuration
const ensureAuthenticated = require('../middlewear/auth');

module.exports = (app) => {
    // Swagger documentation route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.use((req, res, next) => {
        const publicRoutes = ['/auth/login', '/auth/signup', '/auth/google', '/auth/google/callback'];
        if (publicRoutes.includes(req.path)) {
            return next();
        }
        ensureAuthenticated(req, res, next);
    });

    // Authentication routes
    app.use('/auth', authRoutes);

    // User-related routes
    app.use('/users', userRoutes);

    // Database-related routes
    app.use('/db', dbRoutes);

    // Sample API endpoint
    app.get('/api', (req, res) => {
        res.json({ message: 'Hello From Backend' });
    });
};
