//npm install node-binance-api --save

const express = require ('express');
const mongoose = require ('mongoose');
const router = express.Router();

const Client = require ('../models/client');
const ClientSeller = require ('../models/clientBuyer');
const Clientuyer = require ('../models/clientSeller');

const binance = require('node-binance-api')().options({
    APIKEY: 'https://api.binance.com/api/v3/ticker/price',
    //APISECRET: '<secret>',
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
  });
const db ="mongodb://localhost:27017/bitcoinerDB";
// mongodb+srv://waqas3327:03105593105@cluster0-a5wga.mongodb.net/test?retryWrites=true&w=majority
mongoose.Promise = global.Promise;
mongoose.connect(db,{useUnifiedTopology: true,useNewUrlParser:true},function(err){
    if(err){
        console.error("Error ! " + err);
    }
});

router.get('/' , function (req, res){
      res.send('api is working')
});

router.get('/allclients', async (req, res) => {

    const allClients = await Client.find();
    console.log('allClients', allClients);

  });

router.get('/bitapi', function (req, res) {
    console.log('get request of all BTC and ETH API');
    binance.prices('BTCUSDT', (error, ticker) => {
        console.log("Price of BTC: $", ticker.BTCUSDT);
        res.send({
            message: "Price of BTC: $" + ticker.BTCUSDT
          });
      });
      binance.prices('ETHUSDT', (error, ticker) => {
        console.log("Price of ETH: $", ticker.ETHUSDT);
      });
  });


/////////////////////////////////client Seller //////////////////////////////////////
router.get('/clientseller', function (req, res) {
  console.log('get request of all clients');
  //const allClients = await Client.find();
  ClientSeller.find({})
  .exec(function(err , clientssellers){
      if(err){
          console.log('Error while retrieving clients');
      }else{
        // const temp = [

        //   {  "Username": 'Jawad Sahab',
        //     "Email": "String",
        //     "password": "String",
        //     "Phone": "0333-42112414",
        //     "DOB":Date.now(),
        //     "Address": "my address"}
        // ]
        //   // res.send(temp);
        //   res.json(temp);
        res.json(clientssellers);
      }
  });
  // console.log('allClients', allClients);
  // res.send(allClients);
});

/////////////////////////////////////////////////////////////////////////////////////
 


//////////////////////////////////////Client  Buyer//////////////////////////////////
router.get('/clientbuyer', function (req, res) {
  console.log('get request of all clients');
  //const allClients = await Client.find();
  ClientBuyer.find({})
  .exec(function(err , clientsbuyers){
      if(err){
          console.log('Error while retrieving clients');
      }else{
        // const temp = [

        //   {  "Username": 'Jawad Sahab',
        //     "Email": "String",
        //     "password": "String",
        //     "Phone": "0333-42112414",
        //     "DOB":Date.now(),
        //     "Address": "my address"}
        // ]
        //   // res.send(temp);
        //   res.json(temp);
        res.json(clientsbuyers);
      }
  });
  // console.log('allClients', allClients);
  // res.send(allClients);
});
/////////////////////////////////////////////////////////////////////////////////////
  

router.post('/signup', function (req, res) {
  const body = req.body;
  console.log('req.body', body);
  console.log('post a video');  
  
  var newClient = new Client();

  newClient.Username= req.body.Username;
  newClient.Email= req.body.Email;
  newClient.Password= req.body.Password;
  newClient.Phone= req.body.Phone;
  // newClient.DOB= req.body.DOB;
  newClient.Address= req.body.Address;

 // const client = new Client(body);
  //const result = await client.save();
  //console.log(result);
  res.json(newClient);
  newClient.save(function(err, insertedClient){
    if(err){
       console.log('error while saving client');
       res.json(newClient);
    }else {
      res.json(insertedClient);
    }
  }
 );
});

router.post('/login',  async (req, res) => {
    const body = req.body;
    console.log('req.body', body);
    const Email = body.Email;
    const result = await Client.findOne({"Email":  Email});
    if(!result) // this means result is null
    {
      res.status(401).send({
        Error: 'This client doesnot exists. Please signup first'
       });
    }
    else{
      // email did exist
      // so lets match password
      if(body.Password === result.Password){
        // great, allow this user access
        console.log('match');
        res.send({message: 'Successfully Logged in'});
      }
      else{
        console.log('password doesnot match');
        res.status(401).send({message: 'Wrong email or Password'});
      }
    }
  });


////////////////////////////////Clients///////////////////////////////////////////
router.put('/client/:id',function(req,res){
  console.log('update a client');
  Client.findByIdAndUpdate(req.params.id,{
      $set: {username: req.body.username,
         email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          //DOB: req.body.DOB,
          Address: req.body.Address,
      }
  },
  {
      new: true
  },
  function(err, updatedClient){
      if(err){
          res.send("Error updating client")
      }else{
          res.json(updatedClient);
      }
  });
})

router.delete('/client/:id',function(req,res){
  console.log('Deleting a client');
  Client.findByIdAndRemove(req.params.id, function (err, deletedClient){
      if(err){
          res.send("Error deleting client")
      }else{
          res.json(deletedClient);
      }
  })
})

router.get('/clients', function (req, res) {
  console.log('get request of all clients');
  //const allClients = await Client.find();
  Client.find({})
  .exec(function(err , clients){
      if(err){
          console.log('Error while retrieving clients');
      }else{
        // const temp = [

        //   {  "Username": 'Jawad Sahab',
        //     "Email": "String",
        //     "password": "String",
        //     "Phone": "0333-42112414",
        //     "DOB":Date.now(),
        //     "Address": "my address"}
        // ]
        //   // res.send(temp);
        //   res.json(temp);
        res.json(clients);
      }
  });
  // console.log('allClients', allClients);
  // res.send(allClients);
});

router.get('/clients/:id', function (req, res) {
  console.log('get request of single clients');
  //const allClients = await Client.find();
  Client.findById(req.params.id)
  .exec(function(err , client){
      if(err){
          console.log('Error while retrieving video');
      }else{
          res.json(client);
      }
  });
  // console.log('allClients', allClients);

  // res.send(allClients);
});




///////////////////////////////////////////////////////////////////////////




module.exports = router;
