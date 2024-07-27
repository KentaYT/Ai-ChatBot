const { PermissionsBitField } = require("discord.js");
const client = require("../../client");
const { logger } = require("../../functions/logger");
const { developers } = require("../../settings/config");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content: `${interaction.commandName} is not a valid command`,
        ephemeral: true,
      });
    }

    if (!command.execute) {
      console.error(
        `Command ${interaction.commandName} does not have an execute function`
      );
      return interaction.reply({
        content: `An error has occurred while processing a slash command: Command does not have an execute function`,
        ephemeral: true,
      });
    }

    if (command.userPermissions) {
      if (
        !interaction.channel
          .permissionsFor(interaction.member)
          .has(PermissionsBitField.resolve(command.userPermissions || []))
      ) {
        return interaction.reply({
          content: `You do not have the required permissions to use this command. You need the following permissions: ${command.userPermissions.join(
            ", "
          )}`,
          ephemeral: true,
        });
      }
    }

    if (command.clientPermissions) {
      if (
        !interaction.channel
          .permissionsFor(interaction.guild.members.me)
          .has(PermissionsBitField.resolve(command.clientPermissions || []))
      ) {
        return interaction.reply({
          content: `I do not have the required permissions to use this command. I need the following permissions: ${command.clientPermissions.join(
            ", "
          )}`,
          ephemeral: true,
        });
      }
    }

    if (command.developerOnly) {
      if (!developers.includes(interaction.user.id)) {
        return interaction.reply({
          content: `${interaction.commandName} is a developer only command`,
          ephemeral: true,
        });
      }
    }

    await command.execute(interaction, client);
  } catch (err) {
    logger("An error occurred while processing a slash command:", "error");
    console.log(err);

    return interaction.reply({
      content: `An error has occurred while processing a slash command: ${err}`,
      ephemeral: true,
    });
  }
});
