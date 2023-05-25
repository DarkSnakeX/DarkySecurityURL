const fetch = require('node-fetch');
const FormData = require('form-data');
const { apiKey } = require('../config.json');

async function analyzeFile(file, message) {
  const scanResult = await scanFile(file);

  if (scanResult.esPeligroso) {
    message.reply(`El archivo "${file.name}" es peligroso, ten cuidado.`);
  } else {
    message.reply(`El archivo "${file.name}" es seguro (aparentemente).`);
  }
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
    await new Promise(resolve => setTimeout(resolve, 5000));
    return getScanResult(resource);
  }

  return scanResult;
}

module.exports = analyzeFile;
