const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/events').filter((file) => file.endsWith('.js')).forEach((event) => {
        require(`../events/${event}`);
    });
    client.logger.info('Events loaded');
};
