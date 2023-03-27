const fetch = require('node-fetch');
const { Discord, EmbedBuilder, Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent ], partials: [Partials.Channel] });
const { token, apiKey } = require('./config.json');

client.on('ready', () => {
  console.log(`DarkySecurityURL esta lista`);
});

client.on('messageCreate', async message => {
	
  if (!message.content.match(/(https?:\/\/[^\s]+)/g) || message.author.bot) return;

  const urlcabecera = message.content.match(/(https?:\/\/[^\s]+)/g);
  for (const url of urlcabecera) {
    const scaneoresultado = await scaneoURL(url);

    if (scaneoresultado.esPeligrosa) {
      message.channel.send(`La URL "${url}" puede ser peligrosa, ten cuidado.`);
      message.reply("Porfavor ten mas cuidado al enviar enlaces de este estilo");
      //message.author.timeout(1000);
    } else {
      message.channel.send(`La URL "${url}" es segura (aparentemente).`);
    }
  }
});

async function scaneoURL(url) {
  const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${url}`;

  const respuesta = await fetch(apiUrl);
  const datos = await respuesta.json();

  const esPeligrosa = datos.positives > 0;

  return {
    esPeligrosa,
    scanDate: new Date(datos.scan_date),
    scanId: datos.scan_id,
    totalScans: datos.total,
    positives: datos.positives
  };
}



client.login('token');