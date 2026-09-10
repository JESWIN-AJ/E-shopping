// API base URL
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Frontend routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  NOT_FOUND: '*'
} as const

// Backend API endpoints (match server/routes/user.js)
export const ENDPOINTS = {
  PRODUCTS: '/',                    // GET /
  LOGIN: '/login',                  // POST /login
  SIGNUP: '/signup',                // POST /signup
  LOGOUT: '/logout',                // POST /logout
  ME: '/me',                        // GET /me
  CART: '/cart',                    // GET /cart
  ADD_TO_CART: '/add-to-cart',      // GET /add-to-cart/:id
  UPDATE_QTY: '/changeproduct-quantity',  // POST /changeproduct-quantity
  REMOVE_FROM_CART: '/remove-from-cart',  // POST /remove-from-cart
  CHECKOUT: '/checkout',            // GET/POST /checkout
  VERIFY_PAYMENT: '/verify-payment', // POST /verify-payment
  ORDERS: '/order-success'          // GET /order-success
} as const;

// localStorage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userUser'
} as const

// Razorpay test key (from server .env)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TIWMpMQNYLpmHE'

// Order status constants (for UI logic)
export const ORDER_STATUS = {
  PLACED: 'placed',
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

// Payment method labels
export const PAYMENT_METHOD_LABELS = {
  cod: 'Cash on Delivery',
  online: 'Online Payment (Razorpay)'
} as const

