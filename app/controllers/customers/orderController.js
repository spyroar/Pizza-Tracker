  
   const Order=require('../../models/order');
   const moment=require('moment')

function orderController()
{
    return {  
          store(req,res)
          {       
     
            const {phone,address}=req.body

      console.log(req.body);
      
      //  Validate

            if(!phone || !address)
            {
                req.flash('error',"All Field are required");
                  return res.redirect('/cart');
            }
           const order=new Order({

              customerId:req.user._id,
              items:req.session.cart.items,
               phone,
               address
           });
       
             order.save().then(result=>{
                  req.flash('success','Order placed SuccessFully');
                  delete req.session.cart;
                  return res.redirect('/customer/orders')
             }).catch(err=>{
                 req.flash('error','Something went wrong');
                 return res.redirect('/cart')
             })
           
          },
          
          async index(req,res){

                const orders=await Order.find({customerId:req.user._id},null,{sort:{createdAt:-1}});

                   res.header('Cache-Control',
                   'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
                  
                  res.render('customer/orders',{orders:orders,moment:moment})
                //  console.log(order); 
          }
    }
}

module.exports=orderController;

