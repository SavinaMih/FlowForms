require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // Ensure path is correct
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');
const loadRoutes = require('./routes/index');
const path = require('path');
const flash = require('connect-flash');
const PgSession = require('connect-pg-simple')(session);

const app = express();
const port = process.env.PORT || 5000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS options
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080',
    credentials: true,
};

// Middleware for logging requests
app.use((req, res, next) => {
    const now = new Date();
    console.log(`${now.toISOString()} - ${req.method} request for '${req.url}'`);
    next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(
    session({
        store: new PgSession({
            conString: process.env.DATABASE_URL, // Connection string for PostgreSQL
        }),
        secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong, unique secret in production
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 1-week expiration for sessions
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
        },
    })
);

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use true for HTTPS
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Passport middleware (make sure this is after session middleware)
app.use(passport.initialize());
app.use(passport.session());

// Import and use centralized routes after initializing Passport
loadRoutes(app);

// Start server
async function startServer() {
    try {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`Swagger Docs are available at http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error("Database connection failed. Server not started:", error);
    }
}

startServer();
