import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SeniorityType, TeamTags } from '../../constants';
import { UseDto } from '../../decorators';
import { TeamEntity } from '../../modules/team/team.entity';

import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import { UserRole } from '../../constants/user-role';
import { UserTeamSettingsEntity } from './user-team-settings.entity';

@Entity({ name: 'user' })
@UseDto(UserDto)
export class UserEntity
  extends AbstractEntity<UserDto> {
  @Column({ nullable: true, unique: true })
  address: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true, type: 'enum', enum: SeniorityType, default: null })
  level?: SeniorityType;

  @Column({ nullable: true, type: 'simple-array', array: true })
  socialLinks?: string[];

  @Column({ nullable: true, type: 'enum', enum: UserRole, array: true, default: null })
  roles?: UserRole[];

  @Column({ nullable: true, type: 'enum', enum: TeamTags, array: true, default: null })
  tags?: TeamTags[];

  @ManyToMany(() => TeamEntity, (teamEntity) => teamEntity.members)
  teams: TeamEntity[];

  @OneToMany(() => UserTeamSettingsEntity, (userTeamSettingsEntity) => userTeamSettingsEntity.user)
  userTeamSettings: UserTeamSettingsEntity[];
}
