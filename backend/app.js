
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
import { config as dotenvConfig } from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import User from './models/User.js';
import configurePassport from './config/passport.js';

// Load environment variables
dotenvConfig();

// Configure Passport
configurePassport();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

// Connection options for better stability
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(MONGO_URI, mongoOptions)
  .then(() => console.log('✅ MongoDB connection initiated'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Please check your MONGO_URI in .env file');
    console.error('Current URI (masked):', MONGO_URI ? MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@') : 'Not set');
  });

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', async () => {
  console.log('✅ Connected to MongoDB');
  try {
    // Seed admin user if configured
  
    const adminPass = process.env.ADMIN_PASSWORD;
    const adminemail = process.env.ADMIN_EMAIL;
    
    if (adminemail && adminPass) {
      const existing = await User.findOne({ email: adminemail });
      if (!existing) {
        const hashed = await bcrypt.hash(adminPass, 10);
        await User.create({ 
      
          email: adminemail, 
          password: hashed, 
          is_admin: true 
        });
        console.log('✅ Admin user created from environment variables');
      }
      // Silent check - admin already exists (no message needed)
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err);
  }
});

// Routes
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import resumeRouter from './routes/resume.js';
import jobRouter from './routes/job.js';
import aimatchRouter from './routes/aimatch.js';
import notificationRouter from './routes/notification.js';
import userRouter from './routes/user.js';
import hrRouter from './routes/hr.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded resumes (protected - only for authenticated HR users)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: [process.env.CORS_ORIGIN], credentials: true }));

// Session configuration for Google OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_change_this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: false // set to true in production with HTTPS
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/aimatch', aimatchRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/user', userRouter);
app.use('/api/hr', hrRouter);
app.use('/api/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Check if this is an API request
  if (req.path.startsWith('/auth') || req.path.startsWith('/api')) {
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
