import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';
 
 export function placeOrder(formObject){

    axios.post('/orders',formObject).then((res)=>{

        new Noty({
          type:"success",
          timeout:1000,
         text:res.data.message
       }).show();

       setTimeout(()=>{
           location.href='/customer/orders';
       },2000)
        // console.log(res.data);

      }).catch((err)=>{
        new Noty({
          type:"error",
          timeout:1000,
         text: err.res.data.message
       }).show();
      })
 }