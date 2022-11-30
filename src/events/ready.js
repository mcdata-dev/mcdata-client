const { ActivityType } = require('discord.js');
const client = require('..');

client.on('ready', () => {
    const activityList = [
        { name: 'Minecraft', type: ActivityType.Competing },
        { name: 'C418\'s music', type: ActivityType.Listening },
        { name: 'Daapjes', type: ActivityType.Watching },
        { name: 'Terraria', type: ActivityType.Playing }
    ];

    let i = 0;
    setInterval(() => {
        if (i >= activityList.length) i = 0;
        client.user.setActivity(activityList[i]);
        i++;
    }, 30000);

    console.log(`Client - Logged in as ${client.user.tag}`);

});