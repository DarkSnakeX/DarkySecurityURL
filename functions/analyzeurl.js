const fetch = require('node-fetch');
const FormData = require('form-data');
const { apiKey } = require('../config.json');

async function analyzeURL(url, message) {
  const scanResult = await scanURL(url);

  if (scanResult.esPeligrosa) {
    message.reply(`La URL "${url}" puede ser peligrosa, ten cuidado.`);
  } else {
    message.reply(`La URL "${url}" es segura (aparentemente).`);
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

module.exports = analyzeURL;
