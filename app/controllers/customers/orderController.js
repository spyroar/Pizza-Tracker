const Order = require("../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    store(req, res) {
      //  Validate
      const { phone, address, stripeToken, paymentType } = req.body;
      if (!phone || !address) {
        return res.status(422).json({ message: "All Field are required" });
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, async(err, placeOrder) => {
            // req.flash('success','Order placed SuccessFully');
            // Stripe Payment

            if (paymentType === 'card') {
                  // stripe.charges.create
                
               const newSession = await stripe.checkout.sessions.create
              ({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "inr",
                  description: `Pizza order : ${placeOrder._id}`,
                })
                .then(() => {
                  placeOrder.paymentStatus = true
                  placeOrder.paymentType = paymentType;
                  placeOrder
                    .save()
                    .then((ord) => {
                      //  Emit Event
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      delete req.session.cart;
                      return res.json({ id: newSession.id },{
                        message:
                          "Payment SuccessfUll,Order placed SuccessFully",
                      });
                    },)
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;
                   console.log(err);
                  return res.json({ message: " Order placed but Payment Failed ,You can pay at delivery time " });
                });
            }

            // return res.redirect('/customer/orders')
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong",
          });
        });
    },

    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });

      res.header(
        "Cache-Control",
        "no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0"
      );

      res.render("customer/orders", { orders: orders, moment: moment });
      //  console.log(order);
    },

    async show(req, res) {
      const order = await Order.findById(req.params.id);

      //     Authorie User

      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customer/singleOrder", { order });
      }

      return res.redirect("/");
    },
  };
}

module.exports = orderController;
