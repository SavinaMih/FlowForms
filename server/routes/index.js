const authRoutes = require('./authRoutes');
const userRoutes = require('./userRouters');
const dbRoutes = require('./dbRoutes');
const { swaggerUi, specs } = require('../swagger'); // Import Swagger configuration

module.exports = (app) => {
    // Swagger documentation route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    // Health check route (optional)
    app.get('/status', (req, res) => {
        res.json({ status: 'Database connected successfully.' });
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
