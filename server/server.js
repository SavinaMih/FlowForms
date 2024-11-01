require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');
const loadRoutes = require('./routes/index');
const sequelize = require('./config/db'); // Import Sequelize instance

const app = express();
const port = process.env.PORT || 5000;

// CORS options
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080',
    credentials: true,
};

// Middleware for logging requests
app.use((req, res, next) => {
    const now = new Date();
    console.log(`${now.toISOString()} - ${req.method} request for '${req.url}'`);
    next(); // Pass control to the next middleware/route handler
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import and use centralized routes
loadRoutes(app); // Load main routes

// Test database connection on startup
async function startServer() {
    try {
        await sequelize.authenticate(); // Test connection to the database
        console.log('Connection to the database has been established successfully.');

        // Start the server if DB connection is successful
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`Swagger Docs are available at http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error("Database connection failed. Server not started:", error);
    }
}

startServer(); // Call the function to start the server
