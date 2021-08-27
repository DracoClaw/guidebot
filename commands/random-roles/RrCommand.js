const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RrCommand extends BaseCommand {
  constructor() {
    super('rr', 'sort', []);
  }

  async run(client, message, args) {

    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("You cannot use this command.");
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have \'MANAGE_ROLES\' permission.");

    var flag = false;
    var roleMembers = [];
    message.channel.send("Mention the role you want to randomize");
    await message.channel.awaitMessages(m => m.author.id == message.author.id,
      { max: 1, time: 15000 }).then(collected => {

        try {
          var role = collected.first().content.replace("<@&", "").split(">")[0];

          roleMembers = message.guild.roles.cache.get(role).members.map(m => m);
        } catch (err) {
          flag = true;

          if (!collected) return message.channel.send("You ran out of time, Re-run command.");

          if (!message.guild.roles.cache.get(role)) return message.channel.send("The mentioned role does not exist.");

          console.log(err);
        }

      });

    const totalMembers = roleMembers.length;
    const estimation = ((0.33 * totalMembers) + (0.02 * (totalMembers / 100))) / 60;
    console.log(`users affected: ${roleMembers.length} | estimated time: ${estimation} mins`);

    if (flag) return;

    var roles = [];
    message.channel.send("Mention all roles you want in the randomization poll");
    await message.channel.awaitMessages(m => m.author.id == message.author.id,
      { max: 1, time: 30000 }).then(collected => {

        try {
          roles = collected.first().content.split("<@&");
          for (let index = 0; index < roles.length; index++) {
            roles[index] = roles[index].replace(">", "").replace(" ", "");
          }
          if (roles.length == 1) return message.channel.send("The mentioned roles do not exist.");
          roles.shift();
          if (roles.length == 1) return message.channel.send("You must mention at least 2 roles.");

          for (let index = 0; index < roles.length; index++) {
            if (message.guild.roles.cache.get(roles[index])) {
              roles[index] = message.guild.roles.cache.get(roles[index]);
            } else {
              return message.channel.send("The mentioned roles do not exist.");
            }
          }

          for (let index = 0; index < roleMembers.length; index++) {

            if (!roleMembers[index].roles.cache.some(r => roles.includes(r))) {
              roleMembers[index].roles.add(roles[Math.floor(Math.random() * roles.length)]);
            }

          }

          message.channel.send("Successfully randomized the role.");

        } catch (err) {
          if (!collected.content) return message.channel.send("You ran out of time, Re-run command.");
          console.log(err);
        }
      });

  }
}