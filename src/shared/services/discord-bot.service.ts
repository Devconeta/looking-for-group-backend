import { Injectable } from '@nestjs/common';
import { ChannelType, Client, Guild } from 'discord.js';

import { TeamEntity } from 'modules/team/team.entity';

@Injectable()
export class DiscordBotService {
    private client: Client;
    private guild: Guild | undefined;

    constructor() {
        this.client = new Client({ intents: ['Guilds'] })
        this.setupListeners();
        this.login();
    }

    private async login(): Promise<void> {
        //await this.client.login(process.env.DISCORD_BOT_TOKEN)
    }

    private setupListeners(): void {
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
            this.guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID as string)
        });
    }

    public createTeamChannels(team: TeamEntity): void {
        if (!this.guild)
            return

        this.guild.channels.create({
            name: `${team.name}`,
            type: ChannelType.GuildVoice,
            userLimit: team.maxMembers,
            parent: "1021981326301204500",
        })
    }
}
