# 🛒 E-Shopping

A full-stack e-commerce web application built with **Node.js**, **Express**, and **Handlebars (HBS)**, backed by **MongoDB**. The app supports two roles — **customers** and **admins** — with a complete shopping flow and an integrated **Razorpay** payment gateway.

---

## 🌟 Features

### 👤 User Side
- User Registration & Login with secure password hashing (bcrypt)
- Browse and search products
- Add to Cart, update quantities, and remove items
- Checkout with order summary
- Online payment via **Razorpay** payment gateway
- View order history and track order status

### 🛠️ Admin Side
- Separate Admin Login
- Admin Dashboard to manage the store
- Add, Edit, Update, and Delete products (with image upload)
- View all customer orders and process them for shipping
- Full search interface for products and orders

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Template Engine | Handlebars (HBS) |
| Database | MongoDB (localhost:27017) |
| Authentication | Express-Session + Bcrypt |
| File Uploads | express-fileupload |
| Payment Gateway | Razorpay |
| Dev Tool | Nodemon |

---

## 📁 Project Structure

```
e-shopping/
│
├── bin/
│   └── www                  # App entry point & server setup
├── config/
│   └── connection.js        # MongoDB connection
├── routes/
│   ├── user.js              # User routes
│   └── admin.js             # Admin routes
├── views/
│   ├── layout/              # HBS layout files
│   ├── partials/            # Reusable HBS partials
│   ├── user/                # User-facing pages
│   └── admin/               # Admin panel pages
├── public/                  # Static files (CSS, JS, images)
├── .env                     # Environment variables (do not share!)
├── .gitignore
├── app.js                   # Express app configuration
└── package.json
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port 27017)
- npm (comes with Node.js)
- A [Razorpay](https://razorpay.com/) account for payment keys

---

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/e-shopping.git
   cd e-shopping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root folder and add the following:
   ```env
   DB_COLLECTION=mongodb://localhost:27017
   DB_NAME=shopping
   razorpay_key_id=your_razorpay_key_id
   razorpay_key_secret=your_razorpay_key_secret
   ```

   > ⚠️ Never share your `.env` file or push it to GitHub. It is already listed in `.gitignore`.

4. **Make sure MongoDB is running**
   ```bash
   mongod
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open in your browser**
   ```
   http://localhost:3000
   ```

---

## 🖥️ App Routes Overview

| Page | Route | Access |
|------|-------|--------|
| Home / Products | `/` | Public |
| User Register | `/register` | Public |
| User Login | `/login` | Public |
| Cart | `/cart` | User |
| Checkout | `/checkout` | User |
| Orders | `/orders` | User |
| Admin Login | `/admin/login` | Admin |
| Admin Dashboard | `/admin/dashboard` | Admin |
| Manage Products | `/admin/products` | Admin |
| Add Product | `/admin/add-product` | Admin |
| Manage Orders | `/admin/orders` | Admin |

---

## 💳 Payment Integration

This project uses **Razorpay** as the payment gateway.

- Payments are handled in test mode using Razorpay test keys.
- To use real payments, replace the keys in `.env` with your live Razorpay credentials from the [Razorpay Dashboard](https://dashboard.razorpay.com/).

---

## 📸 Screenshots

> Add your screenshots here after running the project!

```
![Home Page](screenshots/home.png)
![Cart Page](screenshots/cart.png)
![Admin Dashboard](screenshots/admin.png)
```

---

## 🙋 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
