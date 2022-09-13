import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { TeamNotFoundException, UserAlreadyAMemberException, UserNotFoundException } from '../../exceptions';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamEntity } from './team.entity';
import { UserService } from '../../modules/user/user.service';

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
    const team = await this.teamRepository.findOne({ where: { code }, relations: ['members'] });
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

  async getTeams(address?: string): Promise<TeamEntity[]> {
    if (address) {
      //TODO: Crear un exists
      const teams = await this.teamRepository.find({ where: { members: { address } }, relations: ['members'] })
      return this.teamRepository.find({ where: { id: In(teams.map(t => t.id)) }, relations: ['members'] })
    }

    return this.teamRepository.find({ relations: ['members'] });
  }
}
