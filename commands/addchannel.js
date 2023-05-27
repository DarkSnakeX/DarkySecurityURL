const { SlashCommandBuilder } = require('discord.js');
const { addChannel } = require('../database.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addchannel')
		.setDescription('Adds the channel to analyze'),
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			await interaction.reply('No tienes permisos de administrador para ejecutar este comando.');
			return;
		}
        const channelId = interaction.channel.id;
        const res = await addChannel(channelId);
		if(res == 0){
			await interaction.reply('Channel is already added');
		}else{
			await interaction.reply('Channel added.');
		}
        
	},
};