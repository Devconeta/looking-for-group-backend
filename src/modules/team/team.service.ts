import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../modules/user/user.entity';

import type { FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { TeamNotFoundException } from '../../exceptions';
import type { TeamDto } from './dtos/team.dto';
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
  async updateTeam(teamDto: TeamDto): Promise<TeamEntity | null> {
    this.teamRepository.update({ id: (teamDto.id as any) }, teamDto);

    return this.teamRepository.findOne({ where: { id: teamDto.id as any } });
  }


  async joinTeam(address: string, code: string): Promise<TeamEntity | null> {
    const user = await this.userService.findOne({ address })
    const team = await this.teamRepository.findOne({ where: { code } });

    if (team) {
      user && (team.members ? team.members.push(user) : team.members = [user])
      this.teamRepository.save(team)
    }

    return team;
  }


  async getTeams(address: string): Promise<TeamEntity[]> {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .innerJoinAndSelect("team.members", "member")
      .where("member.address = :address", { address })

    return queryBuilder.getMany();
  }

  async getTeam(teamId: Uuid): Promise<TeamDto> {
    const queryBuilder = this.teamRepository.createQueryBuilder('team');

    queryBuilder.where('team.id = :teamId', { teamId });

    const teamEntity = await queryBuilder.getOne();

    if (!teamEntity) {
      throw new TeamNotFoundException();
    }

    return teamEntity.toDto();
  }
}
