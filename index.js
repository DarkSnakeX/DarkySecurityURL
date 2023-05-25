const fetch = require('node-fetch');
const FormData = require('form-data');
const { Discord, EmbedBuilder, Client, GatewayIntentBits, Partials, Message } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent ], partials: [Partials.Channel] });
const { token, apiKey } = require('./config.json');

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
    await analyzeURL(url, message.channel, message);
  }

  for (const file of files) {
    await analyzeFile(file, message.channel, message);
  }
});

async function analyzeURL(url, channel, _message) {
  const scanResult = await scanURL(url);

  if (scanResult.esPeligrosa) {
    _message.reply(`La URL "${url}" puede ser peligrosa, ten cuidado.\nPor favor ten más cuidado al enviar enlaces de este estilo`);
  } else {
    _message.reply(`La URL "${url}" es segura (aparentemente).`);
  }
}

async function analyzeFile(file, channel, _message) {
  const scanResult = await scanFile(file);

  if (scanResult.esPeligroso) {
    _message.reply(`El archivo "${file.name}" es peligroso, ten cuidado.`);
  } else {
    _message.reply(`El archivo "${file.name}" es seguro.`);
  }
}

async function scanURL(url) {
  const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${url}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  const esPeligrosa = data.positives > 0;

  return {
    esPeligrosa,
    scanDate: new Date(data.scan_date),
    scanId: data.scan_id,
    totalScans: data.total,
    positives: data.positives
  };
}

async function scanFile(file) {
  const formData = new FormData();
  formData.append('file', await file.file, file.name);

  const apiUrl = `https://www.virustotal.com/vtapi/v2/file/scan?apikey=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  const resource = data.resource;
  const scanResult = await getScanResult(resource);

  return {
    esPeligroso: scanResult.positives > 0,
    scanDate: new Date(scanResult.scan_date),
    scanId: scanResult.scan_id,
    totalScans: scanResult.total,
    positives: scanResult.positives
  };
}

async function getScanResult(resource) {
  const apiUrl = `https://www.virustotal.com/vtapi/v2/file/report?apikey=${apiKey}&resource=${resource}`;

  let scanResult = await fetch(apiUrl);
  scanResult = await scanResult.json();

  if (scanResult.response_code === 0) {
    // The file is still being scanned, wait for a few seconds and retry
    await new Promise(resolve => setTimeout(resolve, 5000));
    return getScanResult(resource);
  }

  return scanResult;
}

client.login(token);
