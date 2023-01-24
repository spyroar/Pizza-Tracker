const homeController = require("../app/controllers/homeController");
const authController = require("../app/controllers/authController");
const cartController = require("../app/controllers/customers/cartController");
const orderController=require('../app/controllers/customers/orderController')

const AdminOrderController=require('../app/http/admin/orderController');


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

  //  Admin Routes
    
  app.get('/admin/orders',admin,AdminOrderController().index);

}

module.exports = initRoutes;
