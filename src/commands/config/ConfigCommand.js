const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const config = require("../../../config.json");
const path = require("path");
const fs = require("fs").promises;

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super("config", "Configuration", ["cfg"]);
  }

  async run(client, message, args) {
    let result = new Array();

    args.forEach((arg, index) => result.push(`Argument ${index}: ${arg}`));

    switch (args[0]) {
      case "get":
        result.push(`${args[1]} value: ${config[args[1]]}`);
        break;
      case "set":
        config[args[1]] = args[2];
        result.push(this.saveConfig(message));
        result.push(`Config "${args[1]}" updated with value "${args[2]}"!`);
        break;
      case "del":
        delete config[args[1]];
        result.push(this.saveConfig(message));
        result.push(`Config "${args[1]}" deleted!`);
        break;
      case "list":
        result.push(this.listConfigs(message));
        break;
    }

    message.channel.send(result.join("\n"));
  }

  saveConfig() {
    fs.writeFile(
      path.join(__dirname, "../../../config.json"),
      JSON.stringify(config, null, 4)
    );
    return "Config updated!";
  }

  listConfigs(message) {
    const configs = Object.keys(config);
    let list = new Array();

    configs.forEach((prop) => {
      list.push(`${prop}: ${prop == "token" ? "[REDACTED]" : config[prop]}`);
    });

    return list.join("\n");
  }
};
