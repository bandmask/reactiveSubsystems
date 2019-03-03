var NRP = require('node-redis-pubsub');
var config = {
    host: 'redis'
};

const getRandomInt = _ => 1;

var nrp = NRP(config);

nrp.on('pong', (data, channel) => {
    console.log('pong event revieved', channel, data);
    setTimeout(() => {
        nrp.emit('ping', 'ping ping hej hej' + getRandomInt());
    }, 2000);
});

console.log('asdjand')