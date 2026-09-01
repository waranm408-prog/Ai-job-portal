import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function normalizeEnvVar(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^['"]|['"]$/g, '');
}

async function sendOtpEmail(recipient, otp) {
  const brevoApiKey = normalizeEnvVar(process.env.BREVO_API_KEY);
  const senderEmail = normalizeEnvVar(process.env.BREVO_SENDER_EMAIL) || normalizeEnvVar(process.env.ADMIN_EMAIL);

  if (!brevoApiKey || !senderEmail) {
    const missingVars = [];
    if (!brevoApiKey) missingVars.push('BREVO_API_KEY');
    if (!senderEmail) missingVars.push('BREVO_SENDER_EMAIL or ADMIN_EMAIL');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  console.log('Attempting to send email via Brevo...');
  console.log('Sender:', senderEmail);
  console.log('Recipient:', recipient);
  console.log('Brevo key length:', brevoApiKey.length);

  const emailPayload = {
    sender: { email: senderEmail, name: 'AI Job Portal' },
    to: [{ email: recipient }],
    subject: 'Password Reset OTP - AI Job Portal',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello,</p>
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">You requested to reset your password. Use the OTP code below:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">This code will expire in <strong>15 minutes</strong>.</p>
          <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">AI Job Portal - Find Your Dream Job with AI</p>
        </div>
      </div>
    `,
    textContent: `Your password reset code is ${otp}. It expires in 15 minutes. If you didn't request this, please ignore this email.`,
  };

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailPayload,
      {
        headers: {
          accept: 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
      }
    );

    if (!response.status || response.status >= 400) {
      const responseData = response.data;
      let errorMessage = `Brevo API error (${response.status})`;
      if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.code) {
        errorMessage = `Brevo error code: ${responseData.code}`;
      }
      throw new Error(errorMessage);
    }

    console.log('Email sent successfully via Brevo');
    return JSON.parse(responseText);
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Brevo email service');
    }
    throw error;
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test email configuration
router.get('/test-email-config', (req, res) => {
  const brevoApiKey = normalizeEnvVar(process.env.BREVO_API_KEY);
  const senderEmail = normalizeEnvVar(process.env.BREVO_SENDER_EMAIL) || normalizeEnvVar(process.env.ADMIN_EMAIL);

  const config = {
    brevoApiKeyConfigured: !!brevoApiKey,
    senderEmailConfigured: !!senderEmail,
    senderEmail: senderEmail || 'Not configured',
    apiKeyLength: brevoApiKey ? brevoApiKey.length : 0,
    apiKeyPreview: brevoApiKey ? `${brevoApiKey.substring(0, 10)}...` : 'Not configured'
  };
  
  res.json({
    status: 'Email configuration status',
    config,
    ready: config.brevoApiKeyConfigured && config.senderEmailConfigured,
    message: config.brevoApiKeyConfigured && config.senderEmailConfigured 
      ? 'Email service is configured' 
      : 'Email service is NOT properly configured. Check environment variables.'
  });
});



router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation
  if (!normalizedName || !password) return res.status(400).json({ error: 'name and password required' });
  if (!normalizedEmail) return res.status(400).json({ error: 'email required' });
  if (!emailPattern.test(normalizedEmail)) return res.status(400).json({ error: 'valid email required' });
  if (password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' });

  try {
    console.log('Signup attempt for email:', normalizedEmail);
    
    // Check for existing user
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      console.log('User already exists:', normalizedEmail);
      return res.status(409).json({ error: 'email already exists' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create new user
    const allowedRoles = ['user', 'hr', 'admin'];
    const userRole = allowedRoles.includes(req.body.role) ? req.body.role : 'user';

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hash,
      role: userRole,
      is_admin: false,
    });

    console.log('User created successfully:', normalizedEmail);

    // Generate token
    const payload = { 
      id: user._id, 
      email: user.email, 
      name: user.name || user.email, 
      role: user.role,
      is_admin: user.is_admin 
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({ token, user: payload });
  } catch (err) {
    console.error('Signup error:', err);
    
    // Handle MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
      console.log('Duplicate key error for email:', normalizedEmail);
      return res.status(409).json({ error: 'email already exists' });
    }
    
    res.status(500).json({ error: 'internal error', details: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });

    const payload = { id: user._id, email: user.email, name: user.name || user.email, role: user.role, is_admin: user.is_admin };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!email) return res.status(400).json({ error: 'email required' });

  try {
    console.log('Forgot password request for:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = expires;
    await user.save();
    console.log('OTP generated and saved for:', email, 'OTP:', otp);

    try {
      await sendOtpEmail(email, otp);
      console.log('✅ OTP email sent successfully to:', email);
      res.json({ 
        message: 'OTP sent successfully! Check your email inbox and spam folder.',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        expiresInMinutes: 15
      });
    } catch (mailError) {
      console.error('❌ Email sending failed:', mailError.message);
      
      // Clear OTP since email failed
      user.resetOtp = '';
      user.resetOtpExpires = undefined;
      await user.save();
      
      // Provide specific error messages
      let errorMessage = 'Could not send email. ';
      
      if (mailError.message.includes('Missing required environment variables')) {
        errorMessage += 'Email service not configured on server.';
      } else if (mailError.message.includes('unauthorized') || mailError.message.includes('401')) {
        errorMessage += 'Email service API key is invalid.';
      } else if (mailError.message.includes('sender') || mailError.message.includes('not verified')) {
        errorMessage += 'Sender email not verified in Brevo.';
      } else if (mailError.message.includes('Network error')) {
        errorMessage += 'Cannot connect to email service.';
      } else {
        errorMessage += mailError.message;
      }
      
      return res.status(502).json({ 
        error: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? {
          fullError: mailError.message,
          otp: otp // Only in development
        } : undefined
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'internal server error', details: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !otp || !password) return res.status(400).json({ error: 'email, otp, and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' });

  try {
    console.log('Reset password request for:', email);
    const user = await User.findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      console.log('Invalid reset request for:', email);
      return res.status(400).json({ error: 'invalid or expired OTP' });
    }

    if (user.resetOtp !== otp || user.resetOtpExpires < new Date()) {
      console.log('OTP mismatch or expired for:', email);
      return res.status(400).json({ error: 'invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = '';
    user.resetOtpExpires = undefined;
    await user.save();
    console.log('Password reset successful for:', email);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

export default router;


// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

// Initiate Google OAuth authentication
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
    session: false 
  }),
  (req, res) => {
    try {
      console.log('Google OAuth callback successful for:', req.user.email);
      
      // Generate JWT token
      const payload = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name || req.user.email,
        role: req.user.role || 'user',
        is_admin: req.user.is_admin
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
      
      console.log('JWT token generated, redirecting to frontend');
      
      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect('http://localhost:5173/login?error=auth_failed');
    }
  }
);

// Google OAuth status check (for debugging)
router.get('/google/status', (req, res) => {
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasCallbackUrl = !!process.env.GOOGLE_CALLBACK_URL;
  
  res.json({
    configured: hasClientId && hasClientSecret && hasCallbackUrl,
    details: {
      clientId: hasClientId ? 'Configured' : 'Missing',
      clientSecret: hasClientSecret ? 'Configured' : 'Missing',
      callbackUrl: hasCallbackUrl ? process.env.GOOGLE_CALLBACK_URL : 'Missing'
    },
    message: (hasClientId && hasClientSecret && hasCallbackUrl) 
      ? 'Google OAuth is properly configured' 
      : 'Google OAuth is NOT configured. Check .env file'
  });
});
