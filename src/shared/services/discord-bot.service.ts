import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonComponent, ButtonStyle, CategoryChannel, ChannelType, Client, EmbedBuilder, EmbedType, Guild, TextChannel } from 'discord.js';
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
        //await this.client.login(process.env.DISCORD_BOT_TOKEN)
    }

    private setupListeners(): void {
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
            this.guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID as string)
        });

        this.client.on('interactionCreate', async (interaction: BaseInteraction) => {
            if (!interaction.isButton()) return;

            const [teamId, userAddress, action] = interaction.customId?.split('|') || []

            if (action === 'deny') {
                await interaction.message.delete()
                await interaction.reply('Applicant rejected');
            } else if (action === 'accept') {
                await interaction.message.delete()
                await interaction.reply('Applicant accepted!');
            }
        });
    }

    public async createTeamChannels(team: TeamEntity): Promise<{ inviteUrl: string, categoryId: string } | undefined> {
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
            name: `${team.name} voice`,
            type: ChannelType.GuildVoice,
            userLimit: team.maxMembers,
            parent: category.id,
        })

        const textChannel = await this.guild.channels.create({
            name: `${team.name} text`,
            type: ChannelType.GuildText,
            userLimit: team.maxMembers,
            parent: category.id,
        })

        const inviteUrl = await textChannel.createInvite()
        return { inviteUrl: inviteUrl.url, categoryId: category.id }
    }

    public async notifyApplicant(team: TeamEntity, applicant: UserEntity): Promise<void> {
        const category = this.guild?.channels.cache.get(team.discordCategoryId as string) as CategoryChannel

        if (!category)
            return

        const channel = category.children.cache.find(channel => channel.type === ChannelType.GuildText) as TextChannel

        const dataEmbed = new EmbedBuilder()
            .setColor(0x5100ff)
            .setTitle('New applicant')
            .addFields(
                { name: 'Address', value: `${applicant.address}` },
                { name: '\u200B', value: '\u200B' },
                ...(applicant.name ? [{ name: 'Name', value: `${applicant.name ? applicant.name + "\n" : ''}`, inline: true }] : []),
                ...(applicant.socialLinks?.length ? [{ name: 'Socials', value: `${applicant.socialLinks?.length ? applicant.socialLinks.map(a => a.name + ": " + a.link).join("\n") : ''}`, inline: false }] : []),
            )
            .setTimestamp()

        await channel.send({
            content: "",
            components: [
                {
                    type: 1,
                    components: [
                        {
                            style: 2,
                            label: `Deny`,
                            custom_id: `${team.id}|${applicant.address}|deny`,
                            disabled: false,
                            type: 2
                        },
                        {
                            style: 1,
                            label: `Accept`,
                            custom_id: `${team.id}|${applicant.address}|accept`,
                            disabled: false,
                            type: 2
                        }
                    ]
                }
            ],
            embeds: [
                dataEmbed
            ]
        })
    }
}
