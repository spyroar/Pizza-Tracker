
   require('dotenv').config()
const express=require('express');
const app=express();
const path= require('path')
const ejs=require('ejs');
const mongoose=require('mongoose')
const expressLayout = require('express-ejs-layouts');
const session=require('express-session');
const flash=require('express-flash');

const port=process.env.port ||3000;
  require('./app/models/menu')

  app.use(express.json());

  

  const MongoDbStore=require('connect-mongo');
  //  database Cinnection

  const db='mongodb://127.0.0.1:27017/pizza';
  mongoose.connect(db);

  const connection=mongoose.connection;
  connection.once('open', function () {
      console.log('MongoDB running');
    })
    .on('error', function (err) {
      console.log(err);
    });
  

 //   Session store

let mongostore= new MongoDbStore({
     mongoUrl:db,
     collectionName:'sessions'
})


// Session Config

 app.use(session({

         secret:process.env.COOKIE_SECRET,
         resave:false,
         saveUninitialized:false,
         store:mongostore,
         cookie:{maxAge:1000*60*60*24}  //24 hours
      
 }));



 app.use(flash())


 app.use((req,res,next)=>{

      res.locals.session=req.session
      
      next();

})


 //  Set Template Engine
 app.use(expressLayout) ;

 app.set('views',path.join(__dirname,'/resources/views'));
 app.set('view engine','ejs');



//  Inport initRoutes function

  require('./routes/web') (app)


// Set Assets
 app.use(express.static('public'));




app.listen(port,()=>{

      console.log(`Port is listening on ${port}`);
}
)