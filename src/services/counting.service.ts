import { Message, MessageEmbed} from "discord.js";
import { updateGuild } from "./database.service";
import { GuideGuild, CountingError } from "../models";

export async function count(message: Message, guild: GuideGuild): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const newCount = Number(message.content);
            if (isNaN(newCount)) {
                reject(CountingError.NaN);
                return;
            }

            if (!parseInt(message.content, 10) || newCount.toString().indexOf('.') > -1 || newCount.toString().indexOf(',') > -1) {
                reject(CountingError.NaI);
                return;
            }

            if (guild.counting.lastUserTag == message.author.tag && guild.counting.currLimit > guild.counting.limit) {
                reject(CountingError.Limit);
                return;
            }

            const oldCount = guild.counting.currCount;
            console.log(`Current Count: ${oldCount}`);

            if (oldCount + 1 !== newCount) {
                message.channel.send(`Sorry <@${message.author.id}>, but that is not right. The next number was **${oldCount + 1}**. Let's start over!`);

                let currHighscore = guild.counting.bestCount;
                if (currHighscore < oldCount) {
                    guild.counting.bestCount = oldCount;
                    let embedMsg = message.channel.messages.fetch(guild.counting.embedMsg).then((msg: Message) => {
                        const embedMsg = new MessageEmbed()
                        .setTitle("HIGH SCORE")
                        .setDescription(`[${oldCount.toString()}](https://discord.com/channels/${guild.guildId}/${guild.counting.channel}/${guild.counting.lastMsgId})`)
                        .setFooter(guild.counting.lastUserTag)
                        .setTimestamp();
                        msg.edit({ embeds: [embedMsg] })
                    })
                    .catch((error) => console.error(`Unable to get Embed Message: ${error}`));

                    message.channel.send(`NEW HIGHSCORE!! We reached **${oldCount}**! Let's try to surpass that!`);
                }

                guild.counting.currCount = 0;
                updateGuild(guild).then(() => resolve(false)).catch((error) => reject(error));
                return;
            }

            if (guild.counting.lastUserTag == message.author.tag) {
                guild.counting.currLimit++;
            } else {
                guild.counting.lastUserTag = message.author.tag;
                guild.counting.currLimit = 1;
            }
            guild.counting.currCount = newCount;
            guild.counting.lastMsgId = message.id;
            updateGuild(guild).then(() => resolve(true)).catch((error) => reject(error));
        } catch(error) {
            reject(error);
        }
    });
};