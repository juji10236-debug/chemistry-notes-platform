# 🧪 Chemistry Notes Platform

**Grade 11 Chemistry Unit 6 - Complete Learning Platform**

🌐 **Live Demo**: https://chemistry-notes-platform.herokuapp.com

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/juji10236-debug/chemistry-notes-platform.git
cd chemistry-notes-platform
npm install
```

### 2. Configure
```bash
cp .env.example .env
# Edit .env with your Stripe & Gmail keys
```

### 3. Run Locally
```bash
npm start
# Visit http://localhost:3000
```

## 🚀 Deploy to Heroku (Option B)

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### Step 2: Create App
```bash
heroku create your-app-name
```

### Step 3: Add Stripe Keys
Get keys from https://dashboard.stripe.com/apikeys
```bash
heroku config:set STRIPE_PUBLIC_KEY=pk_test_...
heroku config:set STRIPE_SECRET_KEY=sk_test_...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set EMAIL_USER=your-gmail@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

### Step 4: Deploy
```bash
git push heroku main
heroku logs --tail
```

## 💳 Get Stripe Test Keys

1. Go to https://dashboard.stripe.com/register
2. Create account
3. Go to **Developers > API Keys**
4. Copy **Publishable Key** (pk_test_...)
5. Copy **Secret Key** (sk_test_...)
6. Add to `.env` file

## 📧 Get Gmail App Password

1. Enable 2FA on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password
4. Add to `.env` as EMAIL_PASS

## 📋 Features

✅ Complete Unit 6 Notes
✅ Stripe Payment Gateway
✅ JWT Authentication
✅ Email Credentials
✅ Dark/Light Mode
✅ Responsive Design
✅ 15+ Review Questions

## 📁 File Structure

```
├── server.js              # Express backend
├── package.json           # Dependencies
├── Procfile              # Heroku config
├── vercel.json           # Vercel config
├── .env.example          # Config template
├── public/
│   ├── index.html        # Login/Payment page
│   ├── dashboard.html    # User dashboard
│   └── notes.html        # Full Unit 6 notes
└── README.md
```

## 🔐 Security

- JWT token authentication
- Secure password generation
- Email credentials (no storage)
- HTTPS enforced (production)
- CORS protected

## 💰 Payment Flow

1. User enters email
2. Creates Stripe Payment Intent
3. Processes card payment
4. Generates credentials
5. Sends via email
6. Issues JWT token
7. User logs in & accesses notes

## 📞 Support

Email: maybest11a@gmail.com

---

**Built for Ethiopian Students** 🇪🇹
