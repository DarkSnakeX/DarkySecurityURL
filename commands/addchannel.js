const { SlashCommandBuilder } = require('discord.js');
const { addChannel } = require('../database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addchannel')
		.setDescription('Adds the channel to analyze'),
	async execute(interaction) {
        const channelId = interaction.channel.id;
        const res = await addChannel(channelId);
		if(res == 0){
			await interaction.reply('Channel is already accepted.');
		}else{
			await interaction.reply('Channel accepted.');
		}
        
	},
};