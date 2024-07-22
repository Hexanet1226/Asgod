const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

// Load environment variables
const token = process.env.DISCORD_BOT_TOKEN;
const mongoURI = process.env.MONGODB_URI;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Updated schema for users
const userSchema = new mongoose.Schema({
    discordId: String,
    name: String,
    gender: String,
    height: Number,
    boobs: Number,
    butt: Number,
    shaft: Number,
    balls: Number,
    belly: Number,
});

const User = mongoose.model('User', userSchema);

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    // Command to add user information
    if (message.content.startsWith('!addchurner')) {
        const args = message.content.split(' ').slice(1);

        console.log('Parsed arguments:', args);

        if (args.length !== 8) {
            return message.channel.send('Please provide all the required fields: !addchurner Name Gender Height Boobs Butt Shaft Balls Belly');
        }

        const [name, gender, height, boobs, butt, shaft, balls, belly] = args;

        console.log('Height:', height);

        const user = new User({
            discordId: message.author.id,
            name: name,
            gender: gender,
            height: Number(height),
            boobs: Number(boobs),
            butt: Number(butt),
            shaft: Number(shaft),
            balls: Number(balls),
            belly: Number(belly),
        });

        try {
            await user.save();
            message.channel.send(`User ${name} added to the database.`);
        } catch (err) {
            console.error('Error saving user to database', err);
            message.channel.send('Error adding user to the database: ' + err.message);
        }
    } else if (message.content.startsWith('!getchurner')) {
        const charName = message.content.split(' ').slice(1).join(' ');

        try {
            const user = await User.findOne({ name: charName });
            if (user) {
                message.channel.send(`Character ${user.name} found:\nGender: ${user.gender}\nHeight: ${user.height}\nBoobs: ${user.boobs}\nButt: ${user.butt}\nShaft: ${user.shaft}\nBalls: ${user.balls}\nBelly: ${user.belly}`);
            } else {
                message.channel.send(`Character ${charName} not found in the database.`);
            }
        } catch (err) {
            console.error('Error fetching character from database', err);
            message.channel.send('Error fetching character from the database: ' + err.message);
        }
    } else if (message.content.startsWith('!changechurner')) {
        const args = message.content.split(' ').slice(1);

        console.log('Parsed arguments:', args);

        if (args.length < 5) {
            return message.channel.send('Please provide the name of the character followed by one or more things to change, their values, and an operation (sum, multiply, divide, subtract): !changechurner Name Thing1 Value1 Thing2 Value2 Operation');
        }

        const charName = args[0];
        const changes = args.slice(1, -1); // Exclude last element which is the operation
        const operation = args[args.length - 1];

        try {
            const user = await User.findOne({ name: charName });
            if (!user) {
                return message.channel.send(`Character ${charName} not found in the database.`);
            }

            const updatedFields = {};
            changes.forEach((change, index) => {
                if (index % 2 === 0) { // Even indexes are the field names, odd indexes are the values
                    const field = change.toLowerCase();
                    const value = parseFloat(changes[index + 1]);
                    if (!isNaN(value)) {
                        updatedFields[field] = value;
                    }
                }
            });

            Object.keys(updatedFields).forEach((field) => {
                if (operation === 'sum') {
                    user[field] += updatedFields[field];
                } else if (operation === 'multiply') {
                    user[field] *= updatedFields[field];
                } else if (operation === 'divide') {
                    if (updatedFields[field] !== 0) {
                        user[field] /= updatedFields[field];
                    }
                } else if (operation === 'subtract') {
                    user[field] -= updatedFields[field];
                }
            });

            await user.save();

            message.channel.send(`Character ${user.name} updated:\nGender: ${user.gender}\nHeight: ${user.height}\nBoobs: ${user.boobs}\nButt: ${user.butt}\nShaft: ${user.shaft}\nBalls: ${user.balls}\nBelly: ${user.belly}`);
        } catch (err) {
            console.error('Error updating character in the database', err);
            message.channel.send('Error updating character in the database: ' + err.message);
        }
    } else if (message.content.startsWith('!listchurners')) {
        try {
            const users = await User.find({});
            if (users.length > 0) {
                let response = 'List of characters:\n';
                response += 'Name | Gender | Height | Boobs | Butt | Shaft | Balls | Belly\n';
                response += '---------------------------------------------------------------\n';
                users.forEach(user => {
                    response += `${user.name} | ${user.gender} | ${user.height} | ${user.boobs} | ${user.butt} | ${user.shaft} | ${user.balls} | ${user.belly}\n`;
                });
                message.channel.send(response);
            } else {
                message.channel.send('No characters found in the database.');
            }
        } catch (err) {
            console.error('Error fetching characters from database', err);
            message.channel.send('Error fetching characters from the database: ' + err.message);
        }
    }
});

client.login(token);
