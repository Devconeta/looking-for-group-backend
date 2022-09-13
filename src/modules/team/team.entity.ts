import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { UserEntity } from '../../modules/user/user.entity';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { TeamDto } from './dtos/team.dto';
import { AssetDistributionMethods, TeamTags } from '../../constants';

export interface ITeamEntity extends IAbstractEntity<TeamDto> {
  name: string;

  description?: string;

  distribution?: AssetDistributionMethods;

  isPublic: boolean;

  address?: string;

  avatar?: string;

  isContractDeployed?: boolean;

  tags?: TeamTags[];

  slogan?: string;
}

@Entity({ name: 'team' })
@UseDto(TeamDto)
export class TeamEntity
  extends AbstractEntity<TeamDto>
  implements ITeamEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  idea?: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true, type: 'enum', enum: AssetDistributionMethods, default: [] })
  distribution: AssetDistributionMethods;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  code?: string

  @Column({ default: 5 })
  maxMembers?: number

  @Column({ nullable: true })
  contractAddress?: string

  @Column({ nullable: true, type: 'enum', enum: TeamTags, default: [] })
  tags?: TeamTags[];

  @Column({ default: false })
  isContractDeployed: boolean

  @Column({ nullable: true })
  slogan?: string
}
