import { Client,  Message } from "discord.js";
import { updateGuild } from "./database.service";

export async function easterEgg(message: Message) {

	if (message.content === "21") {
				message.react("9️⃣")
				message.react("➕")
				message.react("🔟")
				}
	if (message.content === "42") {
				message.react("🐬")
				}
	if (message.content === "69") {
				message.react("🇳")
				message.react("🇮")
				message.react("🇨")
				message.react("🇪")
				}
	if (message.content === "96") {
				message.react("🇪")
				message.react("🇨")
				message.react("🇮")
				message.react("🇳")
				}
	if (message.content === "100") {
				message.react("💯")
				}
	if (message.content === "101") {
				message.react("🐕")
				message.react("⚫")
				message.react("⚪")
				}
	if (message.content === "123") {
				message.react("4️⃣")
				message.react("5️⃣")
				message.react("6️⃣")
				}
	if (message.content === "314") {
				message.react("🥧")
				}
	if (message.content === "360") {
				message.react("⭕")
				}
	if (message.content === "404") {
				message.react("❗")
				message.react("🇫")
				message.react("🇴")
				message.react("🇺")
				message.react("🇳")
				message.react("🇩")
				}
	if (message.content === "420") {
				message.react("🔥")
				}
	if (message.content === "613") {
				message.react("✡")
				}
	if (message.content === "626") {
				message.react("🌺")
				}
	if (message.content === "666") {
				message.react("😈")
				}
	if (message.content === "1234") {
				message.react("🔢")
				}
}