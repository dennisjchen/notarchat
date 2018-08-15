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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

// Broadcasts a message to all listeners with the message from a user
app.post('/message', function(req, res) {
  io.emit('message', req.body);
});

var server = http.createServer(app);
var io = require("socket.io").listen(server);

// Creates an observable that looks for a client connetion and then gives the client an ID for it to use
var connect = rxjs.Observable.create(function(observer) {
  io.on("connection", function(socket) {
    socket.emit('socketId', {'socketId': socket.id });
    // Executes when there is a successful client connect event
    socket.on('client connect', function(data) {
        console.log('Client connected', socket.id);
        observer.next({'socket': socket, 'data': data, 'event': 'client connect'});
    });
  });

  // Custom unsubscribe function that will close the socket
  return function unsubscribe() {
    io.close();
  }
});

var disconnect = rxjs.Observable.create(function(observer) {
  io.on("connection", function(socket) {
    io.on("disconnect", function(data){
      console.log('Client disconnected', socket.id);
      observer.next({'socketId': socket.id, 'event': 'client disconnect'});
    });
  });
  return function unsubscribe() {
    io.close();
  }
});

var observerConnect = connect
.subscribe(function(obj) {
    var socketId = obj.data.socketId;
    usersMap = usersMap.set(socketId, obj.data);
    console.log(usersMap);
    io.emit('users', usersMap.toArray());
});

var observerDisconnect = disconnect
.subscribe(function(obj) {
    var socketId = obj.socketId;
    var user = usersMap.get(socketId);
    usersMap = usersMap.delete(obj.socketId);
    io.emit('users', usersMap.toArray());
});

server.listen(port, function (error) {
  if(error) {
      console.log(error);
  } else {
    console.log("Running on port", port);
  }
});
