const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get bot ping!"),
  async execute(interaction, client) {
    return interaction.reply({ content: `\`${client.ws.ping}\`ms` });
  },
};
