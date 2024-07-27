const { Events, EmbedBuilder } = require("discord.js");
const client = require("../../client");
const { RsnChat } = require("rsnchat");
const config = require("../../settings/config.js");
const color = require("../../settings/color.js");
const rsnchat = new RsnChat(config.rsnkey);
const aichatSchema = require("../../database/schema/aichatSchema.js");

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const aichatData = await aichatSchema.findOne({
    GuildID: message.guild.id,
  });

  if (!aichatData) return;

  if (message.channel.id !== aichatData.ChannelID) return;
  await message.channel.sendTyping();
  const model = aichatData.Model;

  const prompt = message.content;

  rsnchat[model](prompt)
    .then((response) => {
      if (!response || !response.message) {
        message.reply({
          content: ``,
          embeds: [
            new EmbedBuilder()
              .setColor(color.red)
              .setTitle("Error")
              .setDescription(`> Api is currently down pls try again later`)
              .setTimestamp(),
          ],
        });
        return;
      }

      const maxLength = 2000;
      const messages = [];

      let currentMessage = "";
      response.message.split(" ").forEach((word) => {
        if (currentMessage.length + word.length <= maxLength) {
          currentMessage += ` ${word}`;
        } else {
          messages.push(currentMessage.trim());
          currentMessage = word;
        }
      });

      if (currentMessage) messages.push(currentMessage.trim());

      message.reply({
        content: messages[0],
        allowedMentions: { repliedUser: false },
      });

      messages.slice(1).forEach((msg) => {
        message.channel.send({
          content: msg,
          allowedMentions: { repliedUser: false },
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
});
