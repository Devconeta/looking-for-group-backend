import { SocialLink, defaultLinks } from '../../interfaces/SocialLink';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SeniorityType, TeamTags } from '../../constants';
import { UserRole } from '../../constants/user-role';
import { UseDto } from '../../decorators';
import { TeamEntity } from '../../modules/team/team.entity';
import { UserDto } from './dtos/user.dto';
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
  cover?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true })
  idea?: string;

  @Column({ nullable: true, type: 'jsonb', array: false, default: defaultLinks })
  socialLinks?: Array<SocialLink>;

  @Column({ nullable: true, type: 'enum', enum: SeniorityType, default: null })
  level?: SeniorityType;

  @Column({ nullable: true, type: 'enum', enum: UserRole, array: true, default: "{}" })
  roles?: UserRole[];

  @Column({ nullable: true, type: 'enum', enum: TeamTags, array: true, default: "{}" })
  tags?: TeamTags[];

  @Column({ nullable: false, default: false })
  alreadyEdited: boolean;

  @ManyToMany(() => TeamEntity, (teamEntity) => teamEntity.members)
  teams: TeamEntity[];

  @ManyToMany(() => TeamEntity, (teamEntity) => teamEntity.applicants)
  appliedTeams: TeamEntity[];

  @OneToMany(() => UserTeamSettingsEntity, (userTeamSettingsEntity) => userTeamSettingsEntity.user)
  userTeamSettings: UserTeamSettingsEntity[];
}
