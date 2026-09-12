const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const userAuth = require('../auth/userauth');
const { requireUser } = require('../middleware/authSession');
const { loginLimiter } = require('../middleware/rateLimit');
const {
  signupSchema,
  validate
} = require('../middleware/validation');


// Get CSRF token
router.get('/csrf-token', (req, res) => {
  res.json({
    csrfToken: req.csrfToken(),
  });
});

// Cookie-based auth routes
router.post('/login', loginLimiter, (req, res) => {
  userAuth.doLogin(req, res).then((response) => res.json(response));
});

router.post('/signup', loginLimiter, validate(signupSchema), (req, res) => {
  userAuth.doSignup(req, res).then((response) => res.json(response));
});

router.post('/logout', (req, res) => {
  userAuth.doLogout(req, res).then((response) => res.json(response));
});

router.get('/me', (req, res) => {
  userAuth.getMe(req).then((response) => res.json(response));
});

// Guest-accessible add-to-cart (session-based)
// router.get('/add-to-cart/:id', (req, res) => {
//   // Use user ID if logged in, otherwise use session ID (guest cart)
//   const userId = req.session.user?._id || req.sessionID;
//   productHelpers.addToCart(req.params.id, userId)
//     .then(() => res.json({ status: true }))
//     .catch((err) => res.status(500).json({ error: 'Failed to add to cart' }));
// });


router.get('/', (req, res) => {
  userHelpers.getAllproducts()
    .then((products) => res.json({ products }))
    .catch((err) => res.status(500).json({ error: 'Failed to fetch products' }));
});

router.get('/cart', requireUser, async (req, res) => {
  try {
    const { cartItems, grandTotal } = await userHelpers.getCartProducts(req.session.user._id);
    res.json({ products: cartItems, grandTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add-to-cart/:id', requireUser, (req, res) => {
  userHelpers.addToCart(req.params.id, req.session.user._id)
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(500).json({ error: 'Failed to add to cart' }));
});

router.post('/changeproduct-quantity', requireUser, async (req, res) => {
  try {
    await userHelpers.changeProductQuantity(req.body);
    res.json({ status: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

router.post('/remove-from-cart', requireUser, async (req, res) => {
  try {
    await userHelpers.removeFromCart(req.body);
    res.json({ status: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

router.get('/checkout', requireUser, async (req, res) => {
  try {
    const { cartItems, grandTotal } = await userHelpers.getCartProducts(req.session.user._id);
    res.json({ products: cartItems, grandTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load checkout' });
  }
});

router.post('/checkout', requireUser, async (req, res) => {
  try {
    const products = await userHelpers.getCartProlist(req.session.user._id);
    const total = await userHelpers.getTotalAmount(req.session.user._id);
    const orderId = await userHelpers.placeOrder(req.body, products, total);

    if (req.body.payment === 'cod') {
      res.json({ codSuccess: true, orderId });
    } else {
      const order = await userHelpers.generateRazorpay(orderId, total);
      res.json(order);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

router.get('/order-success', requireUser, async (req, res) => {
  try {
    const orders = await userHelpers.getUserOrders(req.session.user._id);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/verify-payment', requireUser, (req, res) => {
  userHelpers.verifyPayment(req.body)
    .then(() => userHelpers.changePaymentStatus(
      req.body.orderId || req.body['order[receipt]'],
      req.body.razorpay_order_id
    ))
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(400).json({ status: false, error: 'Payment verification failed' }));
});


module.exports = router;