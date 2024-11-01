require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const { swaggerUi, specs } = require('./swagger'); // Import Swagger configuration

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
app.use('/auth', authRoutes);

// Sample API endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Hello From Backend' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger Docs are available at http://localhost:${port}/api-docs`);
});
