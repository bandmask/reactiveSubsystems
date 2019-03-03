var NRP = require('node-redis-pubsub');
var config = {
    host: 'redis'
};

const getResult = e => Math.random() * e * 100;

var nrp = NRP(config);

nrp.on('challangers', (data, channel) => {
    console.log('challange event recieved', channel, data);
    
    Array.apply(null, { length: 3 }).forEach((e, i) => {
        setTimeout(() => {
            nrp.emit('results', `${getResult(i)}`);
        }, 1000);
    });
});

console.log('asdjand')