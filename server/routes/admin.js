
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var adminAuth = require('../auth/adminauth');
const { requireAdmin } = require('../middleware/authSession');
 

// POST /admin/login
router.post('/login', (req, res) => {
  adminAuth.doLogin(req.body)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ error: 'Login failed' }));
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
    .catch((err) => res.status(500).json({ error: 'Failed to fetch products' }));
});

// POST /admin/add-product
const { uploadImage } = require('../helpers/cloudinary'); // adjust path to wherever this file actually lives

router.post('/add-product', requireAdmin, async (req, res) => {
  try {
    const id = await productHelpers.addProduct(req.body);
    let imageUrl = '';

    if (req.files && req.files.image) {
      const result = await uploadImage(req.files.image, id);
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
router.delete('/delete-product/:id', requireAdmin, (req, res) => {
  productHelpers.deleteproduct(req.params.id)
    .then(() => res.json({ status: true }))
    .catch((err) => res.status(500).json({ error: 'Failed to delete product' }));
});  

// GET /admin/edit-product/:id
router.get('/edit-product/:id', requireAdmin , (req, res) => {
  productHelpers.getProductDetails(req.params.id)
    .then((product) => res.json({ product }))
    .catch((err) => res.status(500).json({ error: 'Failed to fetch product' }));
});


router.put('/edit-product/:id', requireAdmin, async (req, res) => {
  try {
    let imageUrl = '';
    if (req.files && req.files.image) {
      const result = await uploadImage(req.files.image, req.params.id);
      imageUrl = result.secure_url;
      req.body.image = imageUrl;   // ← add image URL to update payload
    }
    await productHelpers.updateProduct(req.params.id, req.body);
    res.json({ status: true, image: imageUrl });
  } catch (err) {
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
