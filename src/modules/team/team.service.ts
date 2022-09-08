import { Injectable } from '@nestjs/common';

import type { FindOptionsWhere } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { TeamNotFoundException } from '../../exceptions';
import type { TeamDto } from './dtos/team.dto';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamsPageOptionsDto } from './dtos/teams-page-options.dto';
import type { TeamEntity } from './team.entity';
import { TeamRepository } from './team.repository';

@Injectable()
export class TeamService {
  constructor(
    private teamRepository: TeamRepository
  ) { }

  /**
   * Find single team
   */
  findOne(findData: FindOptionsWhere<TeamEntity>): Promise<TeamEntity | null> {
    return this.teamRepository.findOneBy(findData);
  }


  @Transactional()
  async createTeam(
    teamRegisterDto: TeamCreateDto  ): Promise<TeamEntity> {
    const team = this.teamRepository.create(teamRegisterDto);

    await this.teamRepository.save(team);

    return team;
  }

  async getTeams(address: string, pageOptionsDto: TeamsPageOptionsDto): Promise<PageDto<TeamDto>> {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .innerJoinAndSelect("team.members", "users")
      .where("users.address = :address", { address })
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
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
