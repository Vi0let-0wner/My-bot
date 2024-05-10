const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const keep_alive = require('./keep_alive.js');

const prefix = '/';

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
    
    // Define the token for your bot
    const token = process.env.token;

    // Create a new REST client
    const rest = new REST({ version: '9' }).setToken(1234037890372075550);

    // Define your application commands
    const commands = [];
for (const file of commandFiles) {
    const command = require(file);
    commands.push(command.data);
}

    // Register your application commands with Discord
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(client.user.id, '899919348599238686'),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
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
