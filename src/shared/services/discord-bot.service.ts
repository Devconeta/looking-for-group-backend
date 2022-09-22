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
    await this.client.login(process.env.DISCORD_BOT_TOKEN)
  }

  private setupListeners(): void {
    this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
      this.guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID as string)
    });
  }

  public async createTeamChannels(team: TeamEntity): Promise<void> {
    if (!this.guild)
      return

    const category = await this.guild.channels.create({
      name: `${team.name}`,
      permissionOverwrites: [
        { id: this.guild.id, deny: ['ViewChannel'] },
        { id: "321", allow: ['ViewChannel'] },
      ],
      type: ChannelType.GuildCategory,
      userLimit: team.maxMembers,
    })

    this.guild.channels.create({
      name: `${team.name} text`,
      type: ChannelType.GuildText,
      userLimit: team.maxMembers,
      parent: category.id,
    })

    this.guild.channels.create({
      name: `${team.name} voice`,
      type: ChannelType.GuildVoice,
      userLimit: team.maxMembers,
      parent: category.id,
    })
  }
}
