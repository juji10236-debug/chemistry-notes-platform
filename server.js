const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory user database (use real database in production)
const users = {};
const payments = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random credentials
function generateCredentials() {
  const username = 'user_' + Math.random().toString(36).substr(2, 9);
  const password = Math.random().toString(36).substr(2, 12);
  return { username, password };
}

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { email } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // 100 ETB in cents
      currency: 'etb',
      metadata: { email }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Handle Successful Payment
app.post('/api/payment-success', async (req, res) => {
  try {
    const { email, paymentIntentId } = req.body;
    
    // Generate credentials
    const { username, password } = generateCredentials();
    
    // Store user
    users[username] = {
      email,
      password, // In production, hash this!
      createdAt: new Date(),
      isPaid: true
    };
    
    payments[paymentIntentId] = {
      email,
      username,
      amount: 100,
      currency: 'ETB',
      date: new Date()
    };
    
    // Send credentials via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Chemistry Notes Access - Your Login Credentials',
      html: `
        <h2>✅ Payment Successful!</h2>
        <p>Thank you for purchasing Chemistry Grade 11 Unit 6 Notes!</p>
        <h3>Your Login Credentials:</h3>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><a href="${process.env.FRONTEND_URL}/index.html">Login Now</a></p>
        <p><em>Keep these credentials safe. You can use them to access all notes anytime.</em></p>
      `
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { username, email, isPaid: true },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({ 
      success: true, 
      username, 
      token,
      message: 'Check your email for login credentials'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const user = users[username];
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { username, email: user.email, isPaid: true },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  res.json({ 
    success: true,
    token,
    username,
    email: user.email
  });
});

// Verify Token Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected route - Get user data
app.get('/api/user', verifyToken, (req, res) => {
  res.json({
    username: req.user.username,
    email: req.user.email,
    isPaid: req.user.isPaid
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Frontend: ${process.env.FRONTEND_URL}`);
});
