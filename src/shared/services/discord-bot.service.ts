import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, Guild, TextChannel } from 'discord.js';
import { UserEntity } from '../../modules/user/user.entity';

import { TeamEntity } from '../../modules/team/team.entity';

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

  public async createTeamChannels(team: TeamEntity): Promise<string | undefined> {
    if (!this.guild)
      return undefined

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

    return category.id
  }

  public async notifyApplicant(team: TeamEntity, applicant: UserEntity): Promise<void> {
    const category = this.guild?.channels.cache.get(team.discordCategoryId as string) as CategoryChannel

    if (!category)
      return

    const channel = category.children.cache.find(channel => channel.type === ChannelType.GuildText) as TextChannel

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`${team.id}|${applicant.address}|deny`)
          .setLabel('Deny!')
          .setStyle(ButtonStyle.Secondary),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`${team.id}|${applicant.address}|accept`)
          .setLabel('Accept!')
          .setStyle(ButtonStyle.Primary),
      );

    await channel.send({ content: `New applicant: ${applicant.address}!`, components: [(row as any)] });
  }
}
