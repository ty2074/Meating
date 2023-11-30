console.log("------------------------------");
console.log("AIHI - Currency.js");
console.log("------------------------------");

//----------------------------------------
// Importing modules
//----------------------------------------
var express = require("express");
var app = express();
const bodyParser = require("body-parser");

//------------------------------------------------------
// configuration
//------------------------------------------------------
const hostname = 'localhost';
const port = 3000;


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
function convertCurrency(req, res) {
  // import the request library
  var request = require('request');

  // read our parameters in route
  var fromC = req.body.queryResult.parameters.fromCurrency.toUpperCase();
  var toC = req.body.queryResult.parameters.toCurrency.toUpperCase();
  var amount = req.body.queryResult.parameters.amount;

  var api_key = "3ee7b66960de4aa08c83e3092b0f3dc2";

  var url = `http://data.fixer.io/api/latest?access_key=${api_key}&base=EUR&symbols=${fromC},${toC}`;

  // http://data.fixer.io/api/latest?access_key=1d58ec9e6f9b90e87baab8bcd8c1021c&base=EUR&symbols=SGD,EUR

  //          some string        hello        ,       world
  // var a = "some string" + some_variable + ", " + another_variable;   // <-- string concatenation (addition)
  // var b = `some string${some_variable}, ${another_variable}`;        // <-- Template literals (Template strings)
  // some stringhello, world..

  console.log("url: " + url);

  request(url, function(error, response, body) {
    if (error) {
      res.status(500).send("some error");
    } else {
      // callback wll be triggered once the api responds back with
      // json object
      console.log('body: ' + body);

      // convert the body string to an javascript
      var obj = JSON.parse(body);

      // parse float casts to a floating point
      // ensure its a number
      var rate1 = parseFloat(obj.rates[fromC]);
      var rate2 = parseFloat(obj.rates[toC]);
      console.log('rate1 : ' + rate1);
      console.log('rate2 : ' + rate2);

      var total = parseFloat(amount) * parseFloat(rate2) / parseFloat(rate1);

      // 10000= SGD is equal to 700 USD
      var s = amount + " " + fromC + " is equal to " + total.toFixed(4) + " " + toC;

      var dialogFlow_output = {
        fulfillmentText: s
      };

      // JSON.stringify ensures the object is converted to a string
      // res.send(JSON.stringify(dialogFlow_output));
      res.send(dialogFlow_output);
    }
  });
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
app.get("/", function(req, res) {
  printDebugInfo("/", req);

  res.send('<h1>This is my currency web app!!!!</h1>');
});

// POST >> http://localhost:3000/chat
app.post("/chat", function(req, res) {
  printDebugInfo("/chat", req);

  // let's get the intent name
  var intent = req.body.queryResult.intent.displayName;

  // you can get the intent name from your
  // DialogFlow > Diagnostic Info > Fulfillment Request >
  // queryResult > intent > displayName
  switch (intent) {
    case "convertIntent":
      convertCurrency(req, res);
      break;
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