import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { UserEntity } from '../../modules/user/user.entity';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { TeamDto } from './dtos/team.dto';

export interface ITeamEntity extends IAbstractEntity<TeamDto> {
  name: string;

  description?: string;

  isPublic: boolean;

  avatar?: string;
}

@Entity({ name: 'team' })
@UseDto(TeamDto)
export class TeamEntity
  extends AbstractEntity<TeamDto>
  implements ITeamEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @Column({ nullable: false, default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  avatar?: string;
}
