import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, EmbedType, Guild, TextChannel } from 'discord.js';
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
        { id: this.guild.roles.everyone, deny: ['ViewChannel'] },
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

    await channel.send({
      "content": "",
      "tts": false,
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 2,
              "label": `Deny`,
              "custom_id": `${team.id}|${applicant.address}|deny`,
              "disabled": false,
              "type": 2
            },
            {
              "style": 1,
              "label": `Accept`,
              "custom_id": `${team.id}|${applicant.address}|accept`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ],
      "embeds": [
        {
          "type": EmbedType.Rich,
          "title": `New applicant`,
          "description": "",
          "color": 0x5100ff,
          "fields": [
            {
              "name": `${applicant.address}`,
              "value": `${applicant.name ? applicant.name + "\n" : ''}${applicant.socialLinks?.length ? applicant.socialLinks.map(a => a.name + ": " + a.link).join("\n") : ''} `,
            }
          ]
        }
      ]
    })
  }
}
