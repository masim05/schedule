var socket = io.connect('http://localhost:3000/');
socket.on('error', function (error) {
  console.log('Error on socket', error);
});
