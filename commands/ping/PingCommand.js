const BaseCommand = require('./utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('ping', 'ping', []);
  }

  async run(client, message, args) {
    message.channel.send(`**PONG.** (${client.ws.ping}ms)`);
  }
}
