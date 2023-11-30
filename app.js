console.log("------------------------------");
console.log("Meating Meaty");
console.log("------------------------------");

//----------------------------------------
// Importing modules
//----------------------------------------
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
// importing dataformat (week 6)
// var dateFormat = require('dateformat')


//------------------------------------------------------
// configuration
//------------------------------------------------------
const hostname = 'localhost';
const port = 3000;

// ACTION: include your won API Key (week 6)
// const apikey = "f07f4108cf725ebd667c729045200517";

//------------------------------------------------------
// standard functions
//------------------------------------------------------
/*
  prints useful debugging information about an endpoint we are going to service

  @param urlPattern
    url pattern

  @param req
    request object

  @return
    true/false
 */
function printDebugInfo(urlPattern, req) {
  console.log();
  console.log("-----------[ Debug Info ]------------");

  console.log(`Servicing ${urlPattern} ..`);
  console.log("Servicing " + req.url + " ..");

  console.log("> req.params:" + JSON.stringify(req.params));
  console.log("> req.body:" + JSON.stringify(req.body));

  console.log("--------[ Debug Info Ends ]----------");
  console.log();
}

//------------------------------------------------------
// handler functions
//------------------------------------------------------
function CalculateTotal(req, res) {
  // Extract the two values from the request body
  var qty = req.body.queryResult.parameters['qty'];
  var set_price = req.body.queryResult.parameters['set_price'];


  // Convert the values to numbers
  var qty = parseFloat(qty);
  var set_price = parseFloat(set_price);

  // Calculate the total_price, set to 2 dec
  var total_price = qty * set_price;
  total_price = total_price.toFixed(2);

  // Prepare the response
  const response = {
    total_price :total_price
  };
  // Send the response
  res.send(response);

}

//--------------------------------------------
// Middleware functions
//--------------------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//------------------------------------------------------
// MF configuration
//------------------------------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

//----------------------------------------
// Endpoints
//----------------------------------------
// GET >> http://localhost:3000/
app.get("/", function(req, sres) {
  printDebugInfo("/", req);

  res.send('<h1>This is my weather web app!!!!</h1>');
});

// POST >> http://localhost:3000/chat
app.post("/chat", function(req, res) {
  printDebugInfo("/chat", req);

  // let's get the intent name
  var intent = req.body.queryResult.intent.displayName;

 
  // Entities name:
  // qty 
  // set_price
  // total_price

  switch (intent) {
    case "Takeaway-Qty":
      // meating
      CalculateTotal(req, res);
      
      var dialogFlow_output = {
        fulfillmentText: 'Total price: ${total_price}'
      };

      res.send(dialogFlow_output);
      break;
  
  // when multiple fulfillment, will just add on, change the 'intent' name.   
  // switch (anotherintent) {
  //   case "anotherIntent":
  //     getsomething(req, res);
  //     break;
    
  }
});

//----------------------------------------
// Main
//----------------------------------------
var listener = app.listen(process.env.PORT || 3000, process.env.IP, () => {
  var actual_hostname = process.env.IP;
  var actual_port = listener.address().port;
  console.log(`Server started and accessible via http://${actual_hostname}:${actual_port}/`);
});