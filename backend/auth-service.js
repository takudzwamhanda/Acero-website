// Acero Steel Supply - Authentication Service
// Node.js/Express backend with JWT authentication

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('validator');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/acero_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Utility functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const validateEmail = (email) => {
  return validator.isEmail(email) && email.length <= 255;
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Email verification functions
const sendVerificationEmail = async (email, userId) => {
  try {
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Store verification token
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify Your Email - Acero Steel Supply',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin-bottom: 10px;">🔩 Acero Steel Supply</h1>
            <h2 style="color: #374151; margin-bottom: 20px;">Verify Your Email Address</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for registering with Acero Steel Supply! To complete your registration and secure your account, please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              This verification link will expire in 24 hours. If you didn't create an account with Acero Steel Supply, please ignore this email.
            </p>
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 10px;">
              © ${new Date().getFullYear()} Acero Steel Supply. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const sendPhoneVerificationLink = async (phone, userId) => {
  try {
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for phone links
    
    // Store phone verification token
    await pool.query(
      'INSERT INTO phone_verification_tokens (user_id, token, expires_at, phone) VALUES ($1, $2, $3, $4)',
      [userId, token, expiresAt, phone]
    );
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/phone-login?token=${token}`;
    
    // In a real implementation, you would send this via SMS
    // For now, we'll log it (you can integrate with Twilio, etc.)
    console.log(`Phone verification link for ${phone}: ${verificationUrl}`);
    
    return { success: true, url: verificationUrl };
  } catch (error) {
    console.error('Error generating phone verification link:', error);
    return { success: false, error: error.message };
  }
};

// Audit logging
const logAudit = async (userId, action, resourceType, resourceId, ip, userAgent, details = {}) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, action, resourceType, resourceId, ip, userAgent, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Audit logging error:', error);
  }
};

// Middleware for JWT verification
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Check for account lockout
const checkAccountLockout = async (userId) => {
  const result = await pool.query(
    'SELECT locked_until FROM users WHERE id = $1',
    [userId]
  );
  
  if (result.rows.length > 0 && result.rows[0].locked_until) {
    if (new Date() < new Date(result.rows[0].locked_until)) {
      return true; // Account is locked
    }
  }
  return false;
};

// Lock account after failed attempts
const lockAccount = async (userId) => {
  const lockDuration = 30 * 60 * 1000; // 30 minutes
  const lockUntil = new Date(Date.now() + lockDuration);
  
  await pool.query(
    'UPDATE users SET locked_until = $1, failed_login_attempts = failed_login_attempts + 1 WHERE id = $2',
    [lockUntil, userId]
  );
};

// Reset failed attempts on successful login
const resetFailedAttempts = async (userId) => {
  await pool.query(
    'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1',
    [userId]
  );
};

// Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, company } = req.body;
    const ip = req.ip;
    const userAgent = req.get('User-Agent');

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
      });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, phone, company) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, phone, company, created_at',
      [email, passwordHash, name, phone || null, company || null]
    );

    const user = result.rows[0];

    // Assign customer role
    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', ['customer']);
    if (roleResult.rows.length > 0) {
      await pool.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
        [user.id, roleResult.rows[0].id]
      );
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken();

    // Store refresh token
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );

    // Log audit
    await logAudit(user.id, 'user_registered', 'user', user.id, ip, userAgent);

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, user.id);
    if (!emailSent) {
      console.warn('Failed to send verification email, but registration continues');
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        company: user.company
      },
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.get('User-Agent');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if account is locked
    if (await checkAccountLockout(user.id)) {
      return res.status(423).json({ error: 'Account is temporarily locked due to failed login attempts' });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      await lockAccount(user.id);
      await logAudit(user.id, 'login_failed', 'user', user.id, ip, userAgent, { reason: 'invalid_password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset failed attempts
    await resetFailedAttempts(user.id);

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken();

    // Store refresh token
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );

    // Log audit
    await logAudit(user.id, 'login_success', 'user', user.id, ip, userAgent);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        company: user.company
      },
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email verification endpoint
app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    // Find and validate token
    const tokenResult = await pool.query(
      'SELECT * FROM email_verification_tokens WHERE token = $1 AND used = false AND expires_at > NOW()',
      [token]
    );
    
    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    const verificationToken = tokenResult.rows[0];
    
    // Update user as verified
    await pool.query(
      'UPDATE users SET email_verified = true WHERE id = $1',
      [verificationToken.user_id]
    );
    
    // Mark token as used
    await pool.query(
      'UPDATE email_verification_tokens SET used = true WHERE id = $1',
      [verificationToken.id]
    );
    
    // Log audit
    await logAudit(verificationToken.user_id, 'email_verified', 'user', verificationToken.user_id, req.ip, req.get('User-Agent'));
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend verification email
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    // Find user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    // Invalidate old tokens
    await pool.query(
      'UPDATE email_verification_tokens SET used = true WHERE user_id = $1 AND used = false',
      [user.id]
    );
    
    // Send new verification email
    const emailSent = await sendVerificationEmail(user.email, user.id);
    
    if (emailSent) {
      res.json({ message: 'Verification email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Phone authentication link
app.post('/api/auth/phone-link', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !validatePhone(phone)) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    
    // Find user by phone
    const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this phone number' });
    }
    
    const user = userResult.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Generate phone verification link
    const result = await sendPhoneVerificationLink(phone, user.id);
    
    if (result.success) {
      res.json({ 
        message: 'Authentication link sent to your phone',
        // In development, return the URL for testing
        ...(process.env.NODE_ENV === 'development' && { url: result.url })
      });
    } else {
      res.status(500).json({ error: 'Failed to generate authentication link' });
    }
  } catch (error) {
    console.error('Phone link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Phone authentication verification
app.get('/api/auth/verify-phone', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    // Find and validate token
    const tokenResult = await pool.query(
      'SELECT * FROM phone_verification_tokens WHERE token = $1 AND used = false AND expires_at > NOW()',
      [token]
    );
    
    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    const verificationToken = tokenResult.rows[0];
    
    // Get user
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [verificationToken.user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Mark token as used
    await pool.query(
      'UPDATE phone_verification_tokens SET used = true WHERE id = $1',
      [verificationToken.id]
    );
    
    // Generate JWT tokens
    const jwtToken = generateToken(user.id);
    const refreshToken = generateRefreshToken();
    
    // Store refresh token
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );
    
    // Log audit
    await logAudit(user.id, 'phone_login_success', 'user', user.id, req.ip, req.get('User-Agent'));
    
    res.json({
      message: 'Phone authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        company: user.company,
        email_verified: user.email_verified
      },
      token: jwtToken,
      refreshToken
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, company, email_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, company } = req.body;
    const ip = req.ip;
    const userAgent = req.get('User-Agent');

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    const result = await pool.query(
      'UPDATE users SET name = $1, phone = $2, company = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, name, phone, company',
      [name, phone || null, company || null, req.user.id]
    );

    await logAudit(req.user.id, 'profile_updated', 'user', req.user.id, ip, userAgent);

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }

    await logAudit(req.user.id, 'logout', 'user', req.user.id, req.ip, req.get('User-Agent'));

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const result = await pool.query(
      'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const userId = result.rows[0].user_id;
    const newToken = generateToken(userId);

    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Acero Auth Service running on port ${PORT}`);
});

module.exports = app;
