
   require('dotenv').config()
const express=require('express');
const app=express();
const path= require('path')
const ejs=require('ejs');
const mongoose=require('mongoose')
const expressLayout = require('express-ejs-layouts');

const flash=require('express-flash');
const passport=require('passport');
const session=require('express-session');
const Emitter=require('events')

const port=process.env.port ||3000;
  require('./app/models/menu')
  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({extended:false}))
  const MongoDbStore=require('connect-mongo');


  //  database Cinnection

  // const db='mongodb://127.0.0.1:27017/pizza';

  mongoose.connect(process.env.MONGO_CONNECTION_URL);

  const connection=mongoose.connection;
  connection.once('open', function () {
      console.log('MongoDB running');
    })
    .on('error', function (err) {
      console.log(err);
    });

   

 //   Session store

// let mongostore= new MongoDbStore({
//      mongoUrl:db,
//      collectionName:'sessions'
// })


 // Event Emitter

   const eventEmitter= new Emitter();
   app.set('eventEmitter',eventEmitter)




// Session Config

 app.use(session({

         secret:process.env.COOKIE_SECRET,
         resave:false,
         saveUninitialized:false,
        //  store:mongostore,
        store:MongoDbStore.create({
              mongoUrl:process.env.MONGO_CONNECTION_URL
        }),
         cookie:{maxAge:1000*60*60*24}  //24 hours
      
 }));


 

 


 

// passport config

const passportInit=require('./app/config/passport');
const { join } = require('path');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session())


app.use(flash());

app.use((req,res,next)=>{
  res.locals.session=req.session;
  res.locals.user=req.user; 
  next();

})
 //  Set Template Engine
 app.use(expressLayout) ;
 app.set('views',path.join(__dirname,'/resources/views'));
 app.set('view engine','ejs');



//  Inport initRoutes function

 require('./routes/web')(app)
 const url = require('url');
  app.use((req,res)=>{
       res.status(404).send(`<h1>${req.url} Page Not Found 404</h1>`)
  })


// Set Assets

 

const server= app.listen(port,()=>{

      console.log(`Port is listening on ${port}`);
}
)

// Socket.io

const io=require('socket.io')(server)

  io.on('connection',(socket)=>{
      // join
      // console.log(socket.id);
      socket.on('join',(orderId)=>{
         console.log(orderId);
        socket.join(orderId)
      })
  })


  eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
  })

  eventEmitter.on('orderPlaced',(data)=>{
     io.to('adminRoom').emit('orderPlaced',data)
  })