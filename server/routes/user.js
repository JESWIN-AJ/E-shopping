var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const userAuth = require('../auth/userauth');
const userHelpers = require('../helpers/user-helpers');
const { verifyUserToken } = require('../middleware/auth');










/* GET home page. */
// router.get('/', async function (req, res, next) {
//   let user = req.session.user
//   let cartCount = 0
//   console.log(user)
//   if (user) {
//     cartCount = await userHelpers.getCartCount(user._id);
//   }

//   productHelpers.getAllproducts().then((products) => {
//     console.log(cartCount)


//     res.render('user/view-products', { products, user, cartCount, userheader: true });

//   });
// });

router.get('/', async function (req, res, next) {
  try {
    const products = await productHelpers.getAllproducts();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});







// router.get('/login', (req, res) => {
//   if (req.session.user) {
//     res.redirect('/')
//   } else {
//     res.render('user/login', { "loginErr": req.session.userloginErr, layout: false })
//     req.session.userloginErr = false
//   }

// })


// router.post('/login', (req, res) => {
//   userAuth.doLogin(req.body).then((response) => {
//     console.log(response);
//     if (response.status) {
//       req.session.user = response.user
//       req.session.userloggedIn = true


//       res.redirect('/')
//     } else {
//       req.session.userloginErr = "Invalid username or password"

//       res.redirect('/login')

//     }
//   })

// })

router.post('/login', (req, res) => {
  userAuth.doLogin(req.body)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ error: 'Login failed' }));
});


// router.get('/signup', (req, res) => {
//   res.render('user/signup', { layout: false })
// })

// router.post('/signup', (req, res) => {
//   userAuth.doSignup(req.body).then((response) => {

//     req.session.user = response.user
//     req.session.user.loggedIn = true

//     res.redirect('/')

//   }).catch((err) => {
//     console.log(err);
//     res.render('signup', { layout: false, error: 'Signup failed' });
//   });


// })

router.post('/signup', (req, res) => {
  userAuth.doSignup(req.body)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ error: 'Signup failed' }));
});

// router.get('/logout', (req, res) => {
//   req.session.user = null
//   req.session.userloggedIn = false
//   res.redirect('/');

// });

// router.get('/cart', verifyLogin, async (req, res, next) => {
//   let { cartItems, grandTotal } = await userHelpers.getCartProducts(req.session.user._id)

//   console.log('cartItems:', cartItems)      // ✅ check this in terminal
//   console.log('grandTotal:', grandTotal)    // ✅ check this in terminal

//   res.render('user/cart', {
//     products: cartItems,
//     grandTotal,
//     user: req.session.user
//   })
// })


router.get('/cart', verifyUserToken, async (req, res) => {
  try {
    const { cartItems, grandTotal } = await userHelpers.getCartProducts(req.user._id);
    res.json({ products: cartItems, grandTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});


// router.get('/add-to-cart/:id', verifyLogin, (req, res, next) => {
//   console.log("api cal")
//   userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
//     // res.redirect('/')
//     res.json({ status: true })

//   })


// })

// GET /add-to-cart/:id
router.get('/add-to-cart/:id', verifyUserToken, (req, res) => {
  userHelpers.addToCart(req.params.id, req.user._id)
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(500).json({ error: 'Failed to add to cart' }));
});




// router.post('/changeproduct-quantity', async (req, res, next) => {
//   userHelpers.changeProductQuantity(req.body).then(() => {


//     res.json({ status: true });
//   })
// })

// POST /changeproduct-quantity
router.post('/changeproduct-quantity', async (req, res) => {
  try {
    await userHelpers.changeProductQuantity(req.body);
    res.json({ status: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// router.post('/remove-from-cart', async (req, res) => {
//   userHelpers.removeFromCart(req.body).then(() => {
//     res.json({ status: true });
//   });
// });

// POST /remove-from-cart
router.post('/remove-from-cart', async (req, res) => {
  try {
    await userHelpers.removeFromCart(req.body);
    res.json({ status: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});




// router.get('/checkout', verifyLogin, async (req, res) => {
//   let { cartItems, grandTotal } = await userHelpers.getCartProducts(req.session.user._id)

//   //console.log('cartItems:', cartItems)      l
//   //console.log('grandTotal:', grandTotal)    
//   res.render('user/checkout', {
//     products: cartItems,
//     grandTotal,
//     user: req.session.user
//   })
// });

// GET /checkout — get checkout data
router.get('/checkout', verifyUserToken, async (req, res) => {
  try {
    const { cartItems, grandTotal } = await userHelpers.getCartProducts(req.user._id);
    res.json({ products: cartItems, grandTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load checkout' });
  }
});



// router.post('/checkout', async (req, res) => {
//   console.log('call arived in checkout route');
//   let products = await userHelpers.getCartProlist(req.body.userId)
//   let total = await userHelpers.getTotalAmount(req.body.userId)

//   userHelpers.placeOrder(req.body, products, total).then((orderId) => {
//     console.log('Order ID:', orderId);
//     console.log(total)
//     console.log(req.body.payment) // ✅ Check this in terminal
//     if (req.body.payment == 'cod') {
//       res.json({ codSuccess: true })

//     } else {
//       userHelpers.genraterazorpay(orderId, total).then((order) => {
//         console.log(" this is the order", order);
//         res.json(order)
//       })
//     }

//   })

// });


// POST /checkout — place order
router.post('/checkout', async (req, res) => {
  try {
    const products = await userHelpers.getCartProlist(req.body.userId);
    const total = await userHelpers.getTotalAmount(req.body.userId);
    const orderId = await userHelpers.placeOrder(req.body, products, total);

    if (req.body.payment === 'cod') {
      res.json({ codSuccess: true, orderId });
    } else {
      const order = await userHelpers.genraterazorpay(orderId, total);
      res.json(order);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});




// router.get('/order-success', verifyLogin, async (req, res) => {

//   let orders = await userHelpers.getUserOrders(req.session.user._id)
//   res.render('user/order-success', { orders, user: req.session.user })
// })


// GET /order-success — user orders
router.get('/order-success', verifyUserToken, async (req, res) => {
  try {
    const orders = await userHelpers.getUserOrders(req.user._id);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});



// router.post('/verify-payment', (req, res) => {
//   console.log('Payment verification request received:', req.body)
//   userHelpers.verifyPayment(req.body).then(() => {
//     userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
//       console.log('Payment verified and status updated for order:', req.body['order[receipt]'])
//       res.json({ status: true })
//     }).catch((err) => {
//       console.error('Error updating payment status:', err)
//       res.json({ status: false, error: 'Failed to update payment status' })
//     })
//   }).catch((err) => {
//     console.error('Payment verification failed:', err)
//     res.json({ status: false, error: 'Payment verification failed' })
//   })
// })

// POST /verify-payment
router.post('/verify-payment', (req, res) => {
  userHelpers.verifyPayment(req.body)
    .then(() => userHelpers.changePaymentStatus(req.body['order[receipt]']))
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(400).json({ status: false, error: 'Payment verification failed' }));
});





module.exports = router;
