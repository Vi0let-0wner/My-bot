const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ind',
    description: 'Introduce the bot and gather user information',
    async execute(message, args) {
        try {
            const formFields = ['Name (Nickname)', 'Age', 'Gender', 'Status'];
            const userResponses = {};

            // Send the initial message asking the user to fill out the form
            const formMessage = await message.channel.send(`Please fill out the following form:\n${formFields.map((field, index) => `${index + 1}. ${field}:`).join('\n')}`);

            // Define the filter function for awaiting messages
            const filter = m => m.author.id === message.author.id;

            // Function to collect user's responses for each field
            const collectResponses = async () => {
                for (const field of formFields) {
                    const promptMessage = await message.channel.send(`Please provide your ${field}:`);
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

                    const response = collected.first().content;
                    userResponses[field] = response;

                    // Delete the user's response and the prompt message concurrently
                    await Promise.all([
                        collected.first().delete(),
                        promptMessage.delete()
                    ]);
                }
            };

            // Collect user's responses
            await collectResponses();

            // Mention the user who used the command in the embed's description
            const userMention = message.author.toString();

            // Create an embed to display the completed form with user's responses
            const embed = new MessageEmbed()
                .setTitle('Introduce Yourself')
                .setDescription(`Submitted by: ${userMention}`)
                .setColor('#0099ff')
                .addFields(
                    { name: 'Name (Nickname)', value: userResponses['Name (Nickname)'] },
                    { name: 'Age', value: userResponses['Age'] },
                    { name: 'Gender', value: userResponses['Gender'] },
                    { name: 'Status', value: userResponses['Status'] }
                );

            // Send the completed form as an embed to the channel
            const sentMessage = await message.channel.send({ embeds: [embed] });

            // Delete the user's command message
            await message.delete();

            // Delete the original form message
            await formMessage.delete();
        } catch (error) {
            console.error('Error occurred:', error);
            // Send an error message without referencing the original message
            await message.channel.send('An error occurred while processing the command.');
        }
    },
};
