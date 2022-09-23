import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { UserEntity } from '../../modules/user/user.entity';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { TeamDto } from './dtos/team.dto';
import { AssetDistributionMethods, TeamTags, UserRole } from '../../constants';

@Entity({ name: 'team' })
@UseDto(TeamDto)
export class TeamEntity
  extends AbstractEntity<TeamDto> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  idea?: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @ManyToMany(() => UserEntity, (userEntity) => userEntity.appliedTeams)
  @JoinTable()
  applicants: UserEntity[];

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true, type: 'enum', enum: AssetDistributionMethods, default: null })
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

  @Column({ nullable: true, type: 'enum', enum: UserRole, array: true, default: "{}" })
  lookingFor?: UserRole[];

  @Column({ nullable: true, type: 'enum', enum: TeamTags, array: true, default: "{}" })
  tags?: TeamTags[];

  @Column({ default: false })
  isContractDeployed: boolean

  @Column({ nullable: true })
  slogan?: string

  @Column({ nullable: true })
  discordCategoryId?: string
}
