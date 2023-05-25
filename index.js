const fetch = require('node-fetch');
const FormData = require('form-data');
const { Discord, EmbedBuilder, Client, GatewayIntentBits, Partials, Message } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent ], partials: [Partials.Channel] });
const { token, apiKey } = require('./config.json');
const analyzeURL = require('./functions/analyzeurl.js');
const analyzeFile = require('./functions/analyzefile.js');

client.on('ready', () => {
  console.log(`DarkySecurityURL está lista`);
});

client.on('messageCreate', async message => {
  if (!message.content.match(/(https?:\/\/[^\s]+)/g) && message.attachments.size === 0 || message.author.bot) return;

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
