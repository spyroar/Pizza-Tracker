const express=require('express');
const app=express();
const path= require('path')
const ejs=require('ejs');
const expressLayout = require('express-ejs-layouts');
const port=process.env.port ||3000;





 //  Set Template Engine
 app.use(expressLayout) ;

 app.set('views',path.join(__dirname,'/resources/views'));
 app.set('view engine','ejs');


 app.get('/',(req,res)=>{
       res.render('home');
 })
 app.get('/cart',(req,res)=>{
      res.render('customer/cart');
});
app.get('/login',(req,res)=>{
      res.render('auth/login');
})
app.get('/register',(req,res)=>{
      res.render('auth/register');
})


// Set Assets
 app.use(express.static('public'));




app.listen(port,()=>{

      console.log(`Port is listening on ${port}`);
}
)