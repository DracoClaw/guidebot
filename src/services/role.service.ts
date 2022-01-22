import { GuildMember } from "discord.js";

export async function assignRandomTeam(member:GuildMember) {
    
    // TODO: Set those as config
    const teamOwls = '865293168894148638';
    const teamNooks = '865293209478103050';
    const teamHedges = '865293251027533895';
    const teamDodos = '865293311287361536';

    let newTeam = '';

    switch(Math.floor(Math.random() * 4) + 1){
        case 1:
            newTeam = teamOwls;
            break;
        case 2:
            newTeam = teamNooks;
            break;
        case 3:
            newTeam = teamHedges;
            break;
        case 4:
            newTeam = teamDodos;
            break;
    }

    if (newTeam) member.roles.add(newTeam);
}