const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json'); // Make sure to replace './config.json' with the path to your config file

const commands = [
    {
        name: 'adduser',
        description: 'Add a new user to the database',
        options: [
            {
                name: 'name',
                description: 'User name',
                type: 'STRING',
                required: true
            },
            {
                name: 'gender',
                description: 'User gender',
                type: 'STRING',
                required: true
            },
            {
                name: 'height',
                description: 'User height',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'boobs',
                description: 'User boobs size',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'butt',
                description: 'User butt size',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'shaft',
                description: 'User shaft size',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'balls',
                description: 'User balls size',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'belly',
                description: 'User belly size',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'imageurl',
                description: 'URL of user image (optional)',
                type: 'STRING',
                required: false
            }
        ]
    }
];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), // Replace clientId and guildId with your bot's client ID and your server's ID
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
