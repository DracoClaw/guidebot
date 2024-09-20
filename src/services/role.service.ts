import { GuildMember } from 'discord.js';

const teams = [
  {
    id: '865293168894148638',
    name: 'The Owls',
    msg: "<:teamOwls:870144665427533857> With Celeste and Blathers by your side, I'm sure you can discover greatness! Your team strives for Knowledge and Truth.",
    channel: '870953808262463508',
  },
  {
    id: '865293209478103050',
    name: 'The Nooklings',
    msg: "<:teamNooklings:870144665557532733> With Timmy and Tommy by your side, I'm sure you can sell out the competition! Your team is all about Community and Growth.",
    channel: '870953792345104434',
  },
  {
    id: '865293251027533895',
    name: 'The Hedgehogs',
    msg: "<:teamHedgehogs:870144665532379238> With Mabel, Sable, and Label by your side, I'm sure you can design your own paths! Your team lives for Innovation and Creativity",
    channel: '870953829049466940',
  },
  {
    id: '865293311287361536',
    name: 'The Dodos',
    msg: "<:teamDodos:870144665691762708> With Orville and Wilbur by your side, I'm sure you can fly to great heights! Your team is all for Exploration and Adventure.",
    channel: '870953761189793812',
  },
];

export async function assignRandomTeam(member: GuildMember) {
  if (member.guild.id !== '695630972082978986') return;

  const randomTeam = teams[Math.floor(Math.random() * teams.length)];

  if (randomTeam) {
    await member.roles.add(randomTeam.id);
    await member
      .send({
        embeds: [
          {
            title: 'Welcome to ACNH.Hub!',
            description:
              "Here's a quick run-down of important things to know.\n\nA full list of all channels and their uses can be found [here](https://discord.com/channels/695630972082978986/1078680203682918420/1078681584707833997).",
            color: 10737070,
            fields: [
              {
                name: 'Teams',
                value: `You have randomly been assigned to ${randomTeam.name} and now have access to <#${randomTeam.channel}>.\n\n${randomTeam.msg}\n\nHow this works is that for each good deed you do, each time you help out a fellow user, or every time you answer a question in one of support channels, as well as many other tasks, you have the chance to earn some points for your team! \n\nAll point additions, as well as the rare subtraction can be tracked in <#870953168329121833>. And a full list of tasks is pinned there.`,
                inline: false,
              },
              {
                name: 'Tickets',
                value:
                  'If you would like to host a [giveaway](<https://discord.com/channels/695630972082978986/703283212104892436>), or need to report a user, this is the place to go. Simply click the button to get started.',
                inline: false,
              },
              {
                name: 'Suggestions',
                value:
                  'If there is something you want to see in the server, do not hesitate to send a message in <#852316816940335144>. After staff review it can be voted on by the community!',
                inline: false,
              },
            ],
          },
        ],
      })
      .catch((error) => console.error(`User's DMs are closed.`));
  }
}