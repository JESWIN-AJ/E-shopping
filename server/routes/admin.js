
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var adminAuth = require('../auth/adminauth');
const { requireAdmin } = require('../middleware/authSession');
const { loginLimiter } = require('../middleware/rateLimit');
const validateObjectId = require('../middleware/validateObjectId');
const {
  adminLoginSchema,
  validate
} = require('../middleware/validation');


// POST /admin/login
router.post('/login', loginLimiter, validate(adminLoginSchema), (req, res) => {
  adminAuth.doLogin(req, res)
    .then((response) => res.json(response))
    .catch((err) => {
      console.error('Admin login error:', err);
      res.status(500).json({ error: 'Login failed' });
    });
});


router.post('/logout', requireAdmin, (req, res) => {
  adminAuth.doLogout(req, res)
    .then((response) => res.json(response))
    .catch((err) => {
      console.error('Admin logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
    });
});

router.get('/me', (req, res) => {
  adminAuth.getMe(req)
    .then((response) => res.json(response))
    .catch((err) => {
      console.error('Admin session check error:', err);
      res.status(500).json({ error: 'Failed to check authentication' });
    });
});

// POST /admin/add-admin
router.post('/add-admin', (req, res) => {
  adminAuth.addAdmin(req.body)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ error: 'Failed to add admin' }));
});

// GET /admin/ — all products
router.get('/', requireAdmin, (req, res) => {
  productHelpers.getAllproducts()
    .then((products) => res.json({ products }))
    .catch((err) => {
      console.error('Add admin error:', err);

      if (err.code === 11000) {
        return res.status(409).json({
          error: 'Admin email already registered'
        });
      }

      return res.status(500).json({
        error: 'Failed to add admin'
      });
    });
});

// POST /admin/add-product
const { uploadImage } = require('../helpers/cloudinary'); // adjust path to wherever this file actually lives

const { validateImageFile } = require('../helpers/validateImage');

router.post('/add-product', requireAdmin, async (req, res) => {
  try {
    const id = await productHelpers.addProduct(req.body);
    let imageUrl = '';

    if (req.files && req.files.image) {
      const file = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;

      const check = await validateImageFile(file);
      if (!check.valid) {
        return res.status(400).json({ error: check.error });
      }

      const result = await uploadImage(file, id);
      imageUrl = result.secure_url;
      await productHelpers.updateProductImage(id, imageUrl);
    }

    res.json({ status: true, productId: id, image: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});


// DELETE /admin/delete-product/:id
router.delete('/delete-product/:id', requireAdmin, validateObjectId('id'), (req, res) => {
  productHelpers.deleteproduct(req.params.id)
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(500).json({ error: 'Failed to delete product' }));
});

// GET /admin/edit-product/:id
router.get('/edit-product/:id', validateObjectId('id'), requireAdmin, (req, res) => {
  productHelpers.getProductDetails(req.params.id)
    .then((product) => res.json({ product }))
    .catch((err) => res.status(500).json({ error: 'Failed to fetch product' }));
});


router.put('/edit-product/:id', requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    let imageUrl = '';

    if (req.files && req.files.image) {
      const file = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;

      const check = await validateImageFile(file);
      if (!check.valid) {
        return res.status(400).json({ error: check.error });
      }

      const result = await uploadImage(file, req.params.id, check.mime);
      imageUrl = result.secure_url;
      req.body.image = imageUrl;
    }

    await productHelpers.updateProduct(req.params.id, req.body);
    res.json({ status: true, image: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// GET /admin/all-orders
router.get('/all-orders', requireAdmin, async (req, res) => {
  try {
    const orders = await productHelpers.getAllOrders();
    const grouped = orders.reduce((acc, order) => {
      const uid = order.userId.toString();
      if (!acc[uid]) {
        acc[uid] = {
          userId: uid,
          mobile: order.deliveryDetails.mobile,
          address: order.deliveryDetails.address,
          userOrders: []
        };
      }
      acc[uid].userOrders.push(order);
      return acc;
    }, {});
    res.json({ groupedOrders: Object.values(grouped) });
  } catch (err) {
    res.status(500).json({ error: 'Error grouping orders' });
  }
});

// POST /admin/ship-order
router.post('/ship-order', requireAdmin, (req, res) => {
  productHelpers.shipOrder(req.body.id)
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(500).json({ error: 'Failed to ship order' }));
});

// GET /admin/all-users
router.get('/all-users', requireAdmin, (req, res) => {
  adminAuth.getAllUsers()
    .then((users) => res.json({ users }))
    .catch((err) => res.status(500).json({ error: 'Failed to fetch users' }));
});

// GET /admin/admin-list
router.get('/admin-list', requireAdmin, (req, res) => {
  adminAuth.getAllAdmins()
    .then((admins) => res.json({ admins }))
    .catch((err) => res.status(500).json({ error: 'Failed to fetch admins' }));
});

module.exports = router;
