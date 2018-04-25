var express = require('express')
var path = require('path')

const port = 3000;
const app = express();

app.use(express.static(__dirname + '/dist' ));

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
