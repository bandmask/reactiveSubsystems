var NRP = require('node-redis-pubsub');
var io = require('socket.io');

var port = 3000;

var server = io.listen(port);
server.origins('*:*');

server.on('connection', socket => {
  console.log('socket.io on connection');
  socket.emit('welcome', 'wilkommen');
});

var config = {
  host: 'redis'
};

const getResult = index => Math.floor(Math.random() * index * 100).toString();

var nrp = NRP(config);

nrp.on('challangers:start', data => {
  console.log('redis pub/sub challangers:start event recieved', data);
    
  Array.apply(null, { length: 3 }).forEach((e, i) => {
    setTimeout(() => {
        let result = getResult(i);
        console.log('getting result', i, result);
        nrp.emit('challangers:result', result);
    }, 1000);
  }); 
});

nrp.on('challangers:end', data => {
  console.log('redis pub/sub challangers:end event recieved', data);
});

console.log(`PlayerApi socket.io listening on port ${port}`);