const { Collection } = require('discord.js');
const ClearIntervals = {
    changelog: 60_000,  //? 1m
    item: 8_640_000,    //? 24h
    server: 600_000,    //? 10m
    uuid: 8_640_000,    //? 24h
};

// Changelog
module.exports.ChangelogCache = new Collection();
module.exports.ChangelogCacheInterval = () => setInterval(() => {
    this.ChangelogCache.clear();
}, ClearIntervals.changelog);

// Item
module.exports.ItemCache = new Collection();
module.exports.ItemCacheInterval = (client) => setInterval(() => {
    client.logger.info('Cleared ItemCache', 'CacheManager');
    this.ItemCache.clear();
}, ClearIntervals.item);


// UUID
module.exports.UuidCache = new Collection();
module.exports.UuidCacheInterval = () => setInterval(() => {
    this.UuidCache.clear();
}, ClearIntervals.uuid);
