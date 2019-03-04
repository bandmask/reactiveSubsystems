var io = require('socket.io');
var server = io.listen(3000);

server.origins('*:*');

var NRP = require('node-redis-pubsub');

server.on('connection', socket => {
  console.log('user connected');
  socket.emit('welcome', 'wilkommen');
});

var config = {
  host: 'redis'
};

const getResult = index => Math.floor(Math.random() * index * 100).toString();

var nrp = NRP(config);

nrp.on('challangers:start', data => {
  console.log('challange event recieved', data);
    
  Array.apply(null, { length: 3 }).forEach((e, i) => {
    setTimeout(() => {
        let result = getResult(i);
        console.log('getting result', i, result);
        nrp.emit('challangers:result', result);
    }, 1000);
  }); 
});

nrp.on('challangers:end', data => {
  console.log('result data recieved', data);
});

console.log('asdjand');