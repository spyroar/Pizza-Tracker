const express=require('express');
const app=express();
const path= require('path')
const ejs=require('ejs');
const expressLayout = require('express-ejs-layouts');
const port=process.env.port ||3000;


// Set Assets


 app.get('/',(req,res)=>{
       res.render('home');
 })


 app.use(express.static('public'));


 //  Set Template Engine
 app.use(expressLayout) ;

 app.set('views',path.join(__dirname,'/resources/views'));
 app.set('view engine','ejs');

app.listen(port,()=>{

      console.log(`Port is listening on ${port}`);
}
)