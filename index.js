const { Discord, EmbedBuilder, Client, Collection, Events, GatewayIntentBits, Partials, Message } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });
const { clientId, guildId, token } = require('./config.json');
const analyzeURL = require('./functions/analyzeurl.js');
const analyzeFile = require('./functions/analyzefile.js');
const { addChannel, removeChannel, getChannels } = require('./database');
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('node:path');

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on('ready', () => {
  console.log(`DarkySecurityURL is ready`);
  client.user.setPresence({ activities: [{ name: 'Searching for malware' }], status: 'dnd' });
});

client.on('messageCreate', async message => {
  if (!message.content.match(/(https?:\/\/[^\s]+)/g) && message.attachments.size === 0 || message.author.bot ||
  	message.content.includes("png") || message.content.includes("jpg") || message.content.includes("gif")) {
  		return;
	}

  const channelId = message.channel.id;
  const channels = await getChannels();

  if (!channels.some(channel => channel.channel_id === channelId)) {
    return;
  }

  const urls = message.content.match(/(https?:\/\/[^\s]+)/g) || [];
  const attachments = Array.from(message.attachments.values());

  const files = attachments.map(attachment => ({
    name: attachment.name,
    file: fetch(attachment.url).then(response => response.buffer())
  }));

  for (const url of urls) {
    await analyzeURL(url, message);
  }

  for (const file of files) {
    await analyzeFile(file, message);
  }
});



client.login(token);
