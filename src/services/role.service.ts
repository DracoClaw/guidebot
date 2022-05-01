import { Client, GuildMember, MessageEmbed, TextChannel } from "discord.js";

export async function assignRandomTeam(member: GuildMember) {
  if (member.guild.id != "695630972082978986") return;

  // TODO: Set those as config
  const owl = "865293168894148638";
  const nook = "865293209478103050";
  const hedge = "865293251027533895";
  const dodo = "865293311287361536";

  const owlName = "The Owls";
  const nookName = "The Nooklings";
  const hedgeName = "The Hedgehogs";
  const dodoName = "The Dodos";

  const owlMsg =
    "<:teamOwls:870144665427533857> With Celeste and Blathers by your side, I'm sure you can discover greatness! Your team strives for Knowledge and Truth.";
  const nookMsg =
    "<:teamNooklings:870144665557532733> With Timmy and Tommy by your side, I'm sure you can sell out the competition! Your team is all about Community and Growth.";
  const hedgeMsg =
    "<:teamHedgehogs:870144665532379238> With Mabel, Sable, and Label by your side, I'm sure you can design your own paths! Your team lives for Innovation and Creativity";
  const dodoMsg =
    "<:teamDodos:870144665691762708> With Orville and Wilbur by your side, I'm sure you can fly to great heights! Your team is all for Exploration and Adventure.";

  const owlChannel = "870953808262463508";
  const nookChannel = "870953792345104434";
  const hedgeChannel = "870953829049466940";
  const dodoChannel = "870953761189793812";

  let newTeam = "";
  let teamMsg = "";
  let teamChannel = "";
  let teamName = "";

  switch (Math.floor(Math.random() * 4) + 1) {
    case 1:
      newTeam = owl;
      teamMsg = owlMsg;
      teamChannel = owlChannel;
      teamName = owlName;
      break;
    case 2:
      newTeam = nook;
      teamMsg = nookMsg;
      teamChannel = nookChannel;
      teamName = nookName;
      break;
    case 3:
      newTeam = hedge;
      teamMsg = hedgeMsg;
      teamChannel = hedgeChannel;
      teamName = hedgeName;
      break;
    case 4:
      newTeam = dodo;
      teamMsg = dodoMsg;
      teamChannel = dodoChannel;
      teamName = dodoName;
      break;
  }

  if (newTeam) {
    member.roles.add(newTeam);
    member
      .send({
        embeds: [
          {
            title: "Welcome to ACNH.Guide!",
            description:
              "Here's a quick rundown of important things to know.\n\nBe sure to claim cosmetic and pingable roles in <#723698264511086624>.\n\nA full list of all channels and their uses can be found [here](https://discord.com/channels/695630972082978986/702309461460779128/781880361733849140).",
            color: 10737070,
            image: {
              url: "https://micro.sylo.digital/file/nanvvc.png",
              proxyURL:
                "https://images-ext-2.discordapp.net/external/gC3XTB7OZK8exrP9ua95ZmyOAfUU-vDnycsp4UK4qEY/https/micro.sylo.digital/file/nanvvc.png",
              width: 1911,
              height: 699,
            },
            fields: [
              {
                name: "Teams",
                value: `You have randomly been assigned to ${teamName} and now have access to <#${teamChannel}>.\n\n${teamMsg}\n\nHow this works is that for each good deed you do, each time you help out a fellow user, or every time you answer a question in one of support channels, as well as many other tasks, you have the chance to earn some points for your team! \n\nAll point additions, as well as the rare subtraction can be tracked in <#870953168329121833>. And a full list of tasks is pinned there.`,
                inline: false,
              },
              {
                name: "Tickets",
                value:
                  "If you would like to host a giveaway (<#703283212104892436>), or need to report a user, this is the place to go. Simply react with click the button to get started.",
                inline: false,
              },
              {
                name: "Suggestions",
                value:
                  "If there is something you want to see in the server, do not hesitate to send a message in <#852316816940335144>. After staff review it can be voted on by the community!",
                inline: false,
              },
            ],
          },
        ],
      })
      .catch((error) => console.error(`User's DMs are closed.`));
  }
}
