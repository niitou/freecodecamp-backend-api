require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
const dns = require("dns")

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/urlShortener.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDB = []
let index = 1

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url
  try {
    const parsedUrl = new URL(url)
    dns.lookup(parsedUrl.hostname, (err, address, family) => {
      if (err) {
        // console.error(err)
        res.json({ error: "invalid url" })
      } else {
        const newURL = {original_url : url, short_url : index}
        index++
        urlDB.push(newURL)
        res.json(newURL)
      }
    })
  } catch (TypeError) {
    res.json({ error: "invalid url" })
  }
})

app.get("/api/shorturl/:id?", (req, res) => {
  const item = urlDB.filter(value => value.short_url == parseInt(req.params.id))
  if(item.length === 0) return res.json({error : "No short URL found for the given input"})
  res.redirect(item[0].original_url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
