const { SlashCommandBuilder } = require('discord.js');
const { removeChannel } = require('../database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removechannel')
		.setDescription('Remove the channel to analyze'),
	async execute(interaction) {
        await removeChannel(interaction.channel.id);
        await interaction.reply('Channel remove');
	},
};