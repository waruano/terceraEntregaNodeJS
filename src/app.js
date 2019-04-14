require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
/*const MemoryStore = require('memorystore')(session)
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'keyboard cat'
}))*/
// Connection URL

/*const dbUtils = require('./dbUtil');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
const client = new MongoClient(urlMongo,{ useNewUrlParser: true });


// Use connect method to connect to the server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  dbUtils.mongoGuardarEstudiante(db,function(result){
    console.log(result);
    });
  client.close();
});*/



const directorioPublico = path.join(__dirname,'../public');
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.use(express.static(directorioPublico));
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
  secret: 'w@ru@n0',
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false, // Secure is Recommeneded, However it requires an HTTPS enabled website (SSL Certificate)
      maxAge: 864000000 // 10 Days in miliseconds
  }
}));

app.use((req,res,next)=>{
  if(req.session.usuario){
    res.locals.session = true;
    res.locals.correo = req.session.correo;
  }
  next();
});


//Routes
app.use(require('./routes/index'));
mongoose.connect(process.env.URLDB, {useNewUrlParser: true},(err,result)=>{
    if(err){
        return console.log(err);
    }
    console.log('conectado');
});
//app.use(express.static(__dirname+'/public'));

app.listen(process.env.PORT,()=>{
    console.log('Aplicación Corriendo en el puerto: '+process.env.PORT);
});