// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  const regex1 = /\d{10,13}/ // For unix input
  const regex2 = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/ //For YYYY-MM-DD input
  let date_string = req.params.date;
  let date;
  if(date_string){
    if(regex1.test(date_string)) {
      if(date_string.length === 10){
        date_string = date_string + "000"
      }
      date = new Date(parseInt(date_string))
      res.json({unix : date.valueOf(), utc : date.toUTCString()})
    }else if(new Date(date_string).toString() !== "Invalid Date"){
      // Use Regex2 for this one, I'm not using it because requirement number 5 required the program to check whether the date is valid or not using new Date()
      date = new Date(date_string)
      res.json({unix : date.valueOf(), utc : date.toUTCString()})
    } else {
      res.json({error : "Invalid Date"})
    }
  } else {
    date = new Date(Date.now())
    res.json({unix : date.valueOf(), utc : date.toUTCString()})
  }
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Timestamp Microservice is listening on port ' + listener.address().port);
});
