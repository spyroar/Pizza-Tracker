
 import axios from "axios";
 import Noty from "noty";
//  const initAdmin=require('./admin')
import initAdmin from "./admin";
import moment from "moment";
  import { initStripe } from "./stripe";
 
 
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

   
  

// Change Order Status
    let statuses=document.querySelectorAll('.status_line');
    // console.log(statuses);
    let hiddenInput=document.getElementById('hiddenInput');
    let order=hiddenInput ? hiddenInput.value :null;
    order=JSON.parse(order);

     let time=document.createElement('small')
    // console.log(order);  
   function updateStatus(order)
   {

    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

     let stepCompleted=true
      statuses.forEach((status)=>{

          let dataProp=status.dataset.status;

          if (stepCompleted) {
            status.classList.add('step-completed')
            
          }
          if(dataProp === order.status)
          {
            stepCompleted=false ;
            time.innerText=moment(order.updatedAt).format('hh:mm A');
             status.appendChild(time)
            if(status.nextElementSibling)
            {
              status.nextElementSibling.classList.add('current')
            }
          }

      })
   }

   updateStatus(order)

   initStripe()
  
  //  Socket

    let socket=io();


    if(order)
    {
           // Join
      socket.emit('join',`order_${order._id}`);
    }

    let AdminAreaPath=window.location.pathname;
    // console.log(AdminAreaPath);
    if (AdminAreaPath.includes('admin')) {

      initAdmin(socket);
       socket.emit('join','adminRoom')
      
    }

    socket.on('orderUpdated',(data)=>{
      const updatedOrder={ ...order }
      updatedOrder.updatedAt=moment().format();
      updatedOrder.status=data.status;
      // console.log(data);
      updateStatus(updatedOrder)
      new Noty({
        type:"success",
        timeout:1000,
       text: "Order Updated"
     }).show();

    })

     

  