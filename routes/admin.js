var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var adminAuth = require('../auth/adminauth');
const { response } = require('../app');


const verifyLogin = (req, res, next) => {
  if ( req.session.adminloggedIn) {
    next()
  } else {
    res.redirect('/admin/adminlogin')  // ✅ include /admin/ prefix
  }
}

router.get('/adminlogin', (req, res) => {
  if (req.session.admin && req.session.admin.loggedIn) {
    res.redirect('admin/')
  } else {
    res.render('admin/adminlogin', { // ✅ removed leading slash
      loginErr: req.session.adminloginErr, 
      layout: false                  // ✅ layout false not admin:false
    })
    req.session.adminloginErr = false
  }
})



router.post('/adminlogin', (req, res) => {
  console.log(req.url)
  adminAuth.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin
      req.session.adminloggedIn = true
      res.redirect('/admin/')        // ✅ redirect to /admin/ not /
    } else {
      req.session.adminloginErr = "Invalid username or password"
      res.redirect('/admin/adminlogin')  // ✅ include /admin/ prefix
    }
  })
})

router.get('/admin/logout', (req, res) => {
  req.session.admin = null
  req.session.adminloggedIn = false
  res.redirect('/admin/adminlogin')  // ✅ include /admin/ prefix
})



router.get('/add-admin',verifyLogin, (req, res) => {
  res.render('admin/add-admin', { admin: false })
})

router.post('/add-admin', (req, res) => {
  adminAuth.addAdmin(req.body).then((response) => {

    req.session.admin = response.admin
    req.session.admin.loggedIn = true

    res.redirect('/admin/')

  }).catch((err) => {
    console.log(err);
    res.render('admin/add-admin', { admin: false, error: 'Failed to add admin' });
  });
})



router.get('/', verifyLogin, (req, res, next) => {

  productHelpers.getAllproducts().then((products) => {

    res.render('admin/view-products', { products, admin: req.session.admin});
  })
});


router.get('/add-product', verifyLogin, (req, res) => {
  res.render('admin/add-product');
})


router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {


    if (req.files && req.files.image) {
      let image = req.files.image;

      image.mv('./public/product-images/' + id + '.jpg', (err) => {
        if (!err) {
          res.render("admin/add-product");
        } else {
          console.error("Move Error Details:", err);
          res.send("Error saving image: " + err.message);
        }
      });
    } else {
      res.render("admin/add-product");
    }
  });
});

router.get('/delete-product/:id', (req, res) => {
  let proid = req.params.id
  console.log(proid);
  productHelpers.deleteproduct(proid).then((responce) => {
    res.redirect('/admin/')
  })



});

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id).then((product) => {

    console.log(product);
    res.render('admin/edit-product', { product, admin: true });



  })
});
router.post('/edit-product/:id', async (req, res) => {

  let id = req.params.id
  console.log(id);
  await productHelpers.updateProduct(id, req.body).then(() => {
    if (req.files && req.files.image) {
      let image = req.files.image;

      image.mv('./public/product-images/' + id + '.jpg')

      res.redirect('/admin/')

    } else {
      res.redirect('/admin/')
    }
  })

});

router.get('/all-orders',  async (req, res) => {
  try {
    let orders = await productHelpers.getAllOrders();

    // Transform the array into a grouped object
    const grouped = orders.reduce((acc, order) => {
      // Get the ID string from the $oid structure
      const uid = order.userId.toString(); 

      if (!acc[uid]) {
        // First time seeing this user: Create the group
        acc[uid] = {
          userId: uid,
          mobile: order.deliveryDetails.mobile,
          address: order.deliveryDetails.address,
          userOrders: []
        };
      }
      
      // Add the current order to this user's array
      acc[uid].userOrders.push(order);
      return acc;
    }, {});

    // Convert the object back into an array so Handlebars can loop through it
    let groupedOrders = Object.values(grouped);
    console.log(groupedOrders);

    res.render('admin/all-orders', { groupedOrders, admin:true});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error grouping orders");
  }
});


router.post('/ship-order', (req, res) => {

  const orderId = req.body.id;
  console.log('Shipping order with ID:', orderId);

  productHelpers.shipOrder(orderId).then(() => {
    console.log('Order shipped successfully:', orderId);
    res.json({ status: true});
  }).catch((err) => {
    console.error('Error shipping order:', err);
    res.status(500).json({ status: false, error: 'Failed to ship order' });
  }); 
});

router.get('/all-users',(req,res)=>{
  adminAuth.getAllUsers().then((users)=>{
    res.render('admin/all-users',{users,admin:true})
  })



})

router.get('/admin-list',(req,res)=>{
  adminAuth.getAllAdmins().then((admins)=>{
    res.render('admin/admin-list',{admins,admin:true})
  })  
})


module.exports = router;
