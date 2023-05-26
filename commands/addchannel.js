const { SlashCommandBuilder } = require('discord.js');
const { addChannel } = require('../database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addchannel')
		.setDescription('Adds the channel to analyze'),
	async execute(interaction) {
        const channelId = interaction.channel.id;
        await addChannel(channelId);
        await interaction.reply('Channel accepted.');
	},
};