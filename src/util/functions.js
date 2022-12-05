module.exports.getCurrentUnix = function getCurrentUnix() {
    return Math.round((new Date()).getTime() / 1000);
};