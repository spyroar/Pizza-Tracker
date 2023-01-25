const homeController = require("../app/controllers/homeController");
const authController = require("../app/controllers/authController");
const cartController = require("../app/controllers/customers/cartController");
const orderController=require('../app/controllers/customers/orderController')

const adminOrderController=require('../app/http/admin/orderController');
const statusController=require('../app/http/admin/statusController');



// Middleware
const guest=require('../app/http/middlewares/guest');
const auth=require('../app/http/middlewares/auth');
const admin=require('../app/http/middlewares/admin');


function initRoutes(app) {
 app.get("/", homeController().index);
  app.get("/login",guest, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guest,authController().register);
  app.post("/register", authController().postRegister);
  app.post('/logout',authController().logout)
  app.get("/cart", cartController().cart);
  app.post("/update-cart",cartController().update)

  app.post('/orders',auth,orderController().store)
  app.get('/customer/orders',auth,orderController().index);
  app.get('/customer/orders/:id',auth,orderController().show);

  //  Admin Routes
    
  app.get('/admin/orders',admin,adminOrderController().index);
  app.post('/admin/order/status',admin,statusController().update);

  

  

}

module.exports = initRoutes;
