import Discord, { Message } from "discord.js";
import * as Registry from "./utils/registry";
import config = require("../config.json");
import CommandHandler from "./utils/commandHandler";

const client = new Discord.Client();
const commandHandler = new CommandHandler(config.prefix);

client.on("ready", () => console.log("GuideBot Started!"));
client.on("message", (message: Message) => commandHandler.handleMessage(message));

client.login(config.token);