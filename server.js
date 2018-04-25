var http = require("http");
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
var immutable = require("immutable");
var rxjs = require("rxjs");

const port = 3000;
var usersMap = immutable.Map({});
const app = express();

app.use(express.static(__dirname + '/dist' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.post('/message', function(req, res) {
  io.emit('message', req.body);
});

var server = http.createServer(app);
var io = require("socket.io").listen(server);

var connect = rxjs.Observable.create(function(observer) {
  io.on("connection", function(socket) {
    console.log('Client connected', socket.id);
    socket.emit('socketId', {'socketId': socket.id });
    socket.on('client connect', function(data) {
        observer.onNext({'socket': socket, 'data': data, 'event': 'client connect'});
    });
  });
  return function() {
    io.close();
  }
});

var disconnect = rxjs.Observable.create(function(observer) {
  io.on("connection", function(socket) {
    io.on("disconnect", function(data){
      observer.onNext({'socketId': socket.id, 'event': 'client disconnect'});
    });
  });
  return function() {
    io.close();
  }
});

var observerConnect = connect
.subscribe(function(obj) {
    var socketId = obj.data.socketId;
    usersMap = usersMap.set(socketId, obj.data);
    //console.log(usersMap);
    io.emit('all users', usersMap.toArray());
});

var observerDisconnect = disconnect
.subscribe(function(obj) {
    var socketId = obj.socketId;
    var user = usersMap.get(socketId);
    usersMap = usersMap.delete(obj.socketId);
    io.emit('all users', usersMap.toArray());
});

server.listen(port, function (error) {
  if(error) {
      console.log(error);
  } else {
    console.log("Running on port", port);
  }
});
