import axios from "axios";
import Noty from "noty";
import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from "./apiService";
export async function initStripe(){

  const stripe = await loadStripe('pk_test_51MUm48SBHezlxcf4YwdBFb2urSeoCkkZ2OK4RLkURGz7qYA2z7cUDqcckQetcppG2bAquozds8Q2JP44uEryjdac00W3Iehmkx');
      const paymentType=document.querySelector('#paymentType');
      let card=null;
          function mountWidget()

          {
          
            const elements=stripe.elements();
            let style = {
         base: {
         color: '#32325d',
         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
         fontSmoothing: 'antialiased',
         fontSize: '16px',
         '::placeholder': {
             color: '#aab7c4'
         }
         },
         invalid: {
         color: '#fa755a',
         iconColor: '#fa755a'
         }
        
     };
     card= elements.create('card',{style,hidePostalCode:true})
     card.mount('#card-element')
         
    }
        if(!paymentType)
        {
          return;
        }

        paymentType.addEventListener('change',(e)=>{
           console.log(e.target.value);

            if (e.target.value) {

               mountWidget();
              
            } else {

               card.destroy();
              
            }

        })

      //   Ajex Call

  let paymentForm= document.querySelector('#payment-form')

  if(paymentForm)
  {
    paymentForm.addEventListener('submit',(e)=>{

      e.preventDefault();
      let formData =new FormData(paymentForm);
      let formObject={};
      for(let [key,value] of formData.entries()){
          formObject[key]=value
        
      }

      if (!card) {
         placeOrder(formObject)
         console.log(formObject);
        return; 
      }

      //  Verify Card

        stripe.createToken(card).then((result)=>{
           
             formObject.stripeToken=result.token.id;
              placeOrder(formObject)
              console.log(formObject);
        }).catch((err)=>{

           console.log(err);
        })
  
     
      

   })

  }

}