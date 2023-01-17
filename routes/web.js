const homeController = require("../app/controllers/homeController");
const authController = require("../app/controllers/authController");
const cartController = require("../app/controllers/customers/cartController");

function initRoutes(app) {
 app.get("/", homeController().index);
  app.get("/login", authController().login);
  app.get("/register", authController().register);
  app.get("/cart", cartController().cart);
  app.post("/update-cart",cartController().update)
}

module.exports = initRoutes;
