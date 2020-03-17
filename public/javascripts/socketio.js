console.log("hello");
var socket = io.connect('http://127.0.0.1:3000'); // connec to server
socket.on('news', function (data) { // listen to news event raised by the server
  console.log(data);
});
