const mongoose=require('mongoose');

const orderSchema=  mongoose.Schema({
 
      customerId:{
                 type:mongoose.Schema.Types.ObjectId,
                 ref:'User',
                 required:true
      },
   
       items:{type:Object,required:true},
       phone:{type:Number,required:true},
       address:{type:String,required:true},
       paymentType:{type:String,default:"COD"},
       paymentStatus:{type:Boolean,default:false},
       status:{type:String,default:"order_placed"},

  },{timestamps:true});


module.exports = mongoose.model('Order',orderSchema)




