const { SlashCommandBuilder } = require('discord.js');
const { removeChannel } = require('../database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removechannel')
		.setDescription('Remove the channel to analyze'),
	async execute(interaction) {
        const res = await removeChannel(interaction.channel.id);
		if(res == 0){
			await interaction.reply('Channel is already removed');
		}else{
			await interaction.reply('Channel removed');
		}
        
	},
};