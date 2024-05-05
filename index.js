const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const keep_alive = require('./keep_alive.js')
const prefix = '!'; 

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const commandFiles = ['./commands/ping.js', './commands/ind.js'];

for (const file of commandFiles) {
    const command = require(file);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Vi0let sl6ve is ready!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error('Error executing command:', error);
        message.reply('There was an error executing that command.');
    }
});

client.login(process.env.token);
