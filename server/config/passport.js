const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Serialize user by storing user ID in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user by fetching user from database by ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Local strategy for authentication
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                // Find user by email
                const user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                // Check if password matches
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

module.exports = passport;
