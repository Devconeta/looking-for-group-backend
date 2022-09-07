import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import type { TeamDtoOptions } from './dtos/team.dto';
import { TeamDto } from './dtos/team.dto';
import type { ITeamEntity } from './team.entity';
import { TeamEntity } from './team.entity';

export interface ITeamSettingsEntity extends IAbstractEntity<TeamDto> {
  isEmailVerified?: boolean;

  isPhoneVerified?: boolean;

  team?: ITeamEntity;
}

@Entity({ name: 'team_settings' })
@UseDto(TeamDto)
export class TeamSettingsEntity
  extends AbstractEntity<TeamDto, TeamDtoOptions>
  implements ITeamSettingsEntity
{
  @Column({ default: false })
  isEmailVerified?: boolean;

  @Column({ default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'uuid' })
  teamId?: string;

  @OneToOne(() => TeamEntity, (team) => team.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team?: TeamEntity;
}
