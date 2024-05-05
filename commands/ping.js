module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute: (message, args) => {
        message.channel.send('Pinging...').then(sent => {
            sent.edit(`My! Latency is ${sent.createdTimestamp - message.createdTimestamp}ms.`);
        });
    },
};
