const { SlashCommandBuilder } = require('discord.js');
const { removeChannel } = require('../database.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removechannel')
		.setDescription('Remove the channel to analyze'),
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			await interaction.reply('You dont have administrator permissions to do this.');
			return;
		}
        const res = await removeChannel(interaction.channel.id);
		if(res == 0){
			await interaction.reply('Channel is already removed');
		}else{
			await interaction.reply('Channel removed');
		}
        
	},
};