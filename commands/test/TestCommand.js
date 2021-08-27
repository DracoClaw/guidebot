const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', []);
  }

  async run(client, message, args) {

    message.channel.send("Mention the role you want to randomize");
    await message.channel.awaitMessages(m => m.author.id == message.author.id,
      { max: 1, time: 15000 }).then(collected => {

        try {
          var role = collected.first().content.replace("<@&", "").split(">")[0];
          role = message.guild.roles.cache.get(role);
          
          console.log(role.members.map(m => m.user.username));

        } catch (err) {
          console.log(err);

          if (!role) {
            message.channel.send("You ran out of time, Re-run command.");
          } else {
            message.channel.send("The mentioned role does not exist.");
          }
        }

      });
  }
}