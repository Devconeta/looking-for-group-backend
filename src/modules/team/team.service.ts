import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import type { FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { TeamNotFoundException, UserAlreadyAMember, UserAlreadyAMemberException, UserNotFoundException } from '../../exceptions';
import type { TeamDto } from './dtos/team.dto';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamEntity } from './team.entity';
import { UserService } from '../../modules/user/user.service';
import { TeamsPageOptionsDto } from './dtos/teams-page-options.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly userService: UserService
  ) { }

  /**
   * Find single team
   */
  findOne(findData: FindOptionsWhere<TeamEntity>): Promise<TeamEntity | null> {
    return this.teamRepository.findOneBy(findData);
  }

  @Transactional()
  async createTeam(teamRegisterDto: TeamCreateDto): Promise<TeamEntity> {
    const user = await this.userService.findOne({ address: teamRegisterDto.address })
    user && (teamRegisterDto.members = [user])

    const team = this.teamRepository.create(teamRegisterDto);

    await this.teamRepository.save(team);

    return team;
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
    const team = await this.teamRepository.findOne({ where: { code } });
    if (!team)
      throw new TeamNotFoundException();

    const user = await this.userService.findOne({ address })

    if (!user)
      throw new UserNotFoundException();

    if (team.members) {
      if (team.members.includes(user))
        throw new UserAlreadyAMemberException();
      else
        team.members.push(user)
    } else {
      team.members = [user]
    }

    return this.teamRepository.save(team);
  }

  async getTeams(address?: string): Promise<TeamEntity[]> {
    if (address) {
      return this.teamRepository.find({ where: { members: { address } }, relations: ['members'] })
    }

    return this.teamRepository.find({ relations: ['members'] });
  }
}
