
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
                const user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

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

// Google strategy for authentication
passport.use(
   new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if a user with this email already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: profile.emails[0].value }
                });

                if (existingUser) {
                    // If user exists but doesn't have Google ID, deny signup with Google
                    if (!existingUser.googleId) {
                        return done(null, false, { message: 'Email already associated with an account.' });
                    }
                    // If user exists with Google ID, proceed with login
                    return done(null, existingUser);
                }

                // If no user exists, create a new user
                const newUser = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                });

                done(null, newUser);
            } catch (error) {
                done(error);
            }
        }
    )
);

module.exports = passport;
