var NRP = require('node-redis-pubsub');
var io = require('socket.io');

var port = 3000;

var server = io.listen(port);
server.origins('*:*');

var s

var namespacedSocket = server.of('/my-namespace');
namespacedSocket.on('connection', socket => {
  console.log('socket.io on connection');
  socket.emit('welcome', 'wilkommen');
  s = socket;
});

var config = {
  host: 'redis'
};

const getResult = index => Math.floor(Math.random() * index * 100).toString();

var nrp = NRP(config);

nrp.on('entity:added:*', (data, channel) => {
  console.log('redis pub/sub entity added', data, channel);
  if (s) {
    console.log('emitting event');
    s.emit('entity', data);
  }
});

nrp.on('entity:removed:*', (data, channel) => {
  console.log('redis pub/sub entity removed', data, channel);
});

nrp.on('entity:reset:*', (data, channel) => {
  console.log('redis pub/sub entity reset', data, channel);
});

console.log(`PlayerApi socket.io listening on port ${port}`);