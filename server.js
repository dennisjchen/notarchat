var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.use(express.static(__dirname + '/dist' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function (error) {
  if(error) {
      console.log(error);
  } else {
    console.log("Running on port", port);
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});
