const sqlite = require('sqlite');
const { open } = sqlite;

const dbPromise = open({
  filename: 'data.db',
  driver: require('sqlite3').Database
});

async function createTable() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS channels (
      channel_id TEXT PRIMARY KEY
    )
  `);
}

createTable()
  .then(() => {
    console.log('Table "channels" is loaded');
  })
  .catch(error => {
    console.error('Error creating table "channels"', error);
  });

  async function addChannel(channelId) {
    const db = await dbPromise;
    
    const existingChannel = await db.get('SELECT * FROM channels WHERE channel_id = ?', channelId);
    if (existingChannel) {
      return 0;
    }
    
    await db.run('INSERT INTO channels (channel_id) VALUES (?)', channelId);
    return 1;
  }
  

  async function removeChannel(channelId) {
    const db = await dbPromise;
  
    const existingChannel = await db.get('SELECT * FROM channels WHERE channel_id = ?', channelId);
    if (!existingChannel) {
      return 0;
    }
  
    await db.run('DELETE FROM channels WHERE channel_id = ?', channelId);
    return 1;
  }
  

async function getChannels() {
  const db = await dbPromise;
  return db.all('SELECT channel_id FROM channels');
}

module.exports = {
  addChannel,
  removeChannel,
  getChannels
};
