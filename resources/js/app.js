
 import axios from "axios";
 import Noty from "noty";
//  const initAdmin=require('./admin')
import initAdmin from "./admin";
 
 
 let addToCart=document.querySelectorAll('.add-to-cart');
 let cartCounter=document.querySelector('#cartCounter');


   
 // UpdateCart 

 function updateCart(pizza)
 {

       axios.post('/update-cart',pizza).then((res)=>{
           console.log(res);
           cartCounter.innerText=res.data.totalQty;
           new Noty({
            type:"success",
            timeout:1000,
           text: "Item added in cart"
         }).show();
       }).catch((err)=>{
        new Noty({
            type:"error",
            timeout:1000,
           text: "Something went Wrong"
         }).show();
    })

      
 }




 addToCart.forEach((btn) => {
    btn.addEventListener('click',(e)=>{
        // console.log(e);
        let pizza=JSON.parse(btn.dataset.pizza);
        // console.log(pizza);
        updateCart(pizza);
    })
   });

   const alertMsg=document.querySelector('#success-alert');
   if (alertMsg) {
      // alert("Hello Order")
       setTimeout(() => {
         alertMsg.remove();
}, 2000);
   }

   initAdmin();
  

   