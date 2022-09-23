import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Like, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { TeamNotFoundException, UserAlreadyAMemberException, UserNotFoundException } from '../../exceptions';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamEntity } from './team.entity';
import { UserService } from '../../modules/user/user.service';
import { DiscordBotService } from '../../shared/services/discord-bot.service';
import { UserAlreadyAppliedException } from '../../exceptions/user-already-applied.exception';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly userService: UserService,
    private discordService: DiscordBotService
  ) { }

  /**
   * Find single team
   */
  findOne(findData: FindOptionsWhere<TeamEntity>): Promise<TeamEntity | null> {
    return this.teamRepository.findOneBy(findData);
  }

  save(newData: TeamEntity): Promise<TeamEntity | null> {
    return this.teamRepository.save(newData);
  }

  @Transactional()
  async createTeam(teamRegisterDto: TeamCreateDto): Promise<Partial<TeamEntity> & { inviteUrl: string }> {
    let inviteUrl

    const user = await this.userService.findOne({ address: teamRegisterDto.address })
    user && (teamRegisterDto.members = [user])

    const team = this.teamRepository.create(teamRegisterDto);
    if (team.isPublic) {
      const channelInfo = await this.discordService.createTeamChannels(team) as any;
      team.discordCategoryId = channelInfo.categoryId;
      inviteUrl = channelInfo.inviteUrl;
    }

    await this.teamRepository.save(team);

    return { ...team, inviteUrl };
  }

  @Transactional()
  async updateTeam(id: string, teamDto: TeamCreateDto): Promise<TeamEntity | null> {

    const result = await this.teamRepository.createQueryBuilder()
      .update(teamDto)
      .where({
        id,
      })
      .returning('*')
      .execute()

    return result.raw[0]
  }

  async joinTeam(address: string, code: string): Promise<TeamEntity | null> {
    const team = await this.teamRepository.findOne({ where: { code }, relations: ['members', 'applicants'] });
    if (!team)
      throw new TeamNotFoundException();

    const user = await this.userService.findOne({ address })

    if (!user)
      throw new UserNotFoundException();

    if (team.members) {
      if (team.members.map(u => u.address).includes(user.address))
        throw new UserAlreadyAMemberException();
      else
        team.members.push(user)
    } else {
      team.members = [user]
    }

    return this.teamRepository.save(team);
  }

  async applyTeam(address: string, teamId: string): Promise<TeamEntity | null> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } as any, relations: ['members', 'applicants'] });

    if (!team || !team.isPublic)
      throw new TeamNotFoundException();

    const user = await this.userService.findOne({ address })

    if (!user)
      throw new UserNotFoundException();

    if (team.members && !team.members.length) {
      if (team.members.map(u => u.address).includes(user.address))
        throw new UserAlreadyAMemberException();
      else
        team.applicants.push(user)
    } else {
      team.applicants = [user]
    }

    if (team.applicants && !team.applicants.length) {
      if (team.applicants.map(u => u.address).includes(user.address))
        throw new UserAlreadyAppliedException();
      else
        team.applicants.push(user)
    } else {
      team.applicants = [user]
    }

    this.discordService.notifyApplicant(team, user)

    return this.teamRepository.save(team);
  }

  async getTeams(address?: string, search?: string): Promise<TeamEntity[]> {
    let options;

    if (address) {
      options = {
        relations: ['members', 'applicants'],
        where: {
          members: {
            address
          }
        }
      }
    } else if (search) {
      options = {
        relations: ['members', 'applicants'],
        where: [
          { name: ILike(`%${search}%`) },
          { address: ILike(`%${search}%`) },
        ]
      }
    } else {
      options = {
        relations: ['members', 'applicants'],
      }
    }

    return this.teamRepository.find(options);
  }
}
