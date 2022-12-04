const moment = require('moment');
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    none: '\x1b[0m'
};

class LogManager {
    constructor(prefix) {
        this.prefix = prefix;
    }

    info(src, message, type) {
        console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${colors.blue}${type ? type : this.prefix} - ${src} | Info${colors.none} - ${message}`);
    }

    ready(src, message, type) {
        console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${colors.cyan}${type ? type : this.prefix} | Ready${colors.none} - ${message}`);
    }

    error(src, message, type) {
        console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] ${colors.red}${type ? type : this.prefix} - ${src} | Error${colors.none} - ${message}`);
    }
}

module.exports = LogManager;