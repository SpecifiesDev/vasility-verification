// import our necessary libraries
const fs = require('fs');
const discord = require('discord.js');

// import local utilities
const logger = require('./utils/Logger.js');

// import our manifestion
const config = JSON.parse(fs.readFileSync('./manifest.json'));

// grab our config values from the manifest
const prefix = config.bot.prefix;
const token = config.bot.token;
const activity = config.bot.activity;


// create a client object
const client = new discord.Client({
    // declare our gateway intents
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        Object.keys(discord.IntentsBitField.Flags)
    ]
});

// create a map to store executable commands
let commands = new Map();

// loop through the command dir and load executable commands
for(let file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    commands.set(file.split('.js')[0], require(`./commands/${file}`));
}

client.on('ready', () => {
    
    logger.info("The bot is now online.");

    client.user.setActivity(activity);

});

client.on('messageCreate', async message => {

    // just return if the author is the bot
    if(message.author.bot) return;

    // create objects of values we made need
    let content = message.content;
    let guildId;

    if(!(message.channel.type === 'dm')) guildId = message.guildId;

        // if the message contains our command prefix
        if(content.indexOf(prefix) == 0) {
            // first we parse the message (including the command executed)
            const args = content.slice(prefix).trim().split(/ +/g);
    
            // grab the parsed command
            const command = args[0].toLowerCase();
    
            // finally, remove the command from arguments because we no longer need it
            args.shift();
    
            // finally we just manually create our commands in case the take special
            // data managers or anything to ease any process of this.
    
            if(command === `${prefix}ping`) commands.get('ping').execute(message);
    
        }

});

client.login(token);