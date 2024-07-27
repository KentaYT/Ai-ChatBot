const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const color = require("../../settings/color.js");
const aichatSchema = require("../../database/schema/aichatSchema");

module.exports = {
  clientPermissions: ["Administrator"],
  userPermissions: ["Administrator"],
  data: new SlashCommandBuilder()
    .setName("aichat")
    .setDescription("aichat subcommands")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Set up a aichat in your server")
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`The channel to select for ai chat`)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("model")
            .setDescription("The Model you want to use")
            .addChoices(
              { name: "GPT 3", value: "gpt" },
              { name: "GPT 4", value: "gpt4" },
              { name: "OpenChat", value: "openchat" },
              { name: "Bard", value: "bard" },
              { name: "Gemini", value: "gemini" },
              { name: "Bing", value: "bing" },
              { name: "Llama", value: "llama" },
              { name: "Mixtral", value: "mixtral" },
              { name: "Codellama", value: "codellama" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`disable`)
        .setDescription(`Disable the greeting system`)
    ),

  async execute(interaction, client) {
    const { options } = interaction;
    const subcommand = options.getSubcommand();
    switch (subcommand) {
      case "setup":
        await setup(interaction, client);
        break;
      case "disable":
        await disable(interaction, client);
        break;
    }
  },
};

async function setup(interaction, client) {
  const channel = interaction.options.getChannel(`channel`);
  const model = interaction.options.getString(`model`);

  const aichatData = await aichatSchema.findOne({
    GuildID: interaction.guild.id,
  });

  if (aichatData) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color.red)
          .setDescription(
            `> Aichat system is already enabled, use \`/aichat disable\` to disable it`
          ),
      ],
    });
  } else {
    await aichatSchema.create({
      GuildID: interaction.guild.id,
      ChannelID: channel.id,
      Model: model,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: "AiChat System",
            iconURL: client.user.displayAvatarURL(),
          })
          .setColor(color.green)
          .setDescription(
            `> AiChat message has been setupped successfully in <#${channel.id}> with model \`${model}\``
          )
          .setTimestamp(),
      ],
    });
  }
}

async function disable(interaction, client) {
  const aichatData = await aichatSchema.findOne({
    GuildID: interaction.guild.id,
  });
  if (!aichatData) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color.red)
          .setDescription(`> AiChat system is already disabled`),
      ],
    });
    return;
  }

  await aichatSchema.findOneAndDelete({ GuildID: interaction.guild.id });

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(color.green)
        .setDescription(`> AiChat system has been disabled`),
    ],
  });
}
