const express = require('express');
const cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/filemetadata.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    try {
      res.json({
        "name": req.file.originalname,
        "type": req.file.mimetype,
        "size": req.file.size
      });
    } catch (err) {
      res.send(400);
    }
  });



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});