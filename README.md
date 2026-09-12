<div align="center">

# 🥦 GreenGrocerShopping

An online grocery shopping platform built with Node.js, Express, and MongoDB — browse products, manage a cart, and check out with integrated online payments.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)

</div>

## 📖 About

GreenGrocerShopping is a full-stack e-commerce app for buying groceries online. Users can browse products, add them to a cart, and pay securely through Razorpay, with order confirmations sent by email.

## ✨ Features

- User authentication with hashed passwords and JWT/session handling
- Product browsing and cart management
- Secure checkout via Razorpay
- Email notifications via Nodemailer
- Image uploads via Multer

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JWT, bcryptjs, express-session, connect-mongo
**Payments:** Razorpay
**Other:** Multer (uploads), Nodemailer (email)
**Frontend:** See `client/`

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Razorpay](https://razorpay.com/) account for payment keys

## 🚀 Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Jahanad-pr/greenGrocerShopping.git
cd greenGrocerShopping

# 2. Install dependencies
npm install
cd client && npm install && cd ..   # if client has its own package.json

# 3. Create a .env file in the root (see variables below)

# 4. Run in development (auto-restarts on change)
npx nodemon index.js

# — or run as it would in production —
npm start
```

The server runs at `http://localhost:3000` by default (or whatever `PORT` you set).

### Environment variables

Create a `.env` file in the project root with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

A `.env.example` with the same keys (no real values) is included in the repo as a reference.

## 🌐 Deploying (Publish)

This project includes a `vercel.json`, so it's set up to deploy on [Vercel](https://vercel.com):

1. Push your code to GitHub (already done).
2. Go to [vercel.com](https://vercel.com), sign in, and click **Add New → Project**.
3. Import this repository.
4. In **Project Settings → Environment Variables**, add the same variables listed above (`MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, etc.) — never commit these, only add them in Vercel's dashboard.
5. Click **Deploy**. Vercel will build and host the app, and give you a live URL.

For the database, use a **MongoDB Atlas** connection string (not `localhost`) since Vercel doesn't have access to your local machine's MongoDB.

**Live Demo:** _[add your deployed link here once live]_

## 📁 Project Structure

```
client/         # Frontend application
config/         # App/database configuration
controllers/    # Route logic
middlewares/    # Express middlewares
models/         # Mongoose schemas
routes/         # Express routes
utils/          # Helper functions
index.js        # Entry point
vercel.json     # Deployment config
```

## 🎥 Demo Video

https://github.com/user-attachments/assets/9376c157-01db-4e71-8390-299a7f8543a0



## 📄 License

Licensed under [MIT](LICENSE).

## 👤 Author

**Jahnad PR** — [@Jahanad-pr](https://github.com/Jahanad-pr)