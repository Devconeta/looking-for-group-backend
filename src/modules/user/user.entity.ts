import { Column, Entity, ManyToMany, OneToOne } from 'typeorm';

import { TeamEntity } from '../../modules/team/team.entity';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { SeniorityType } from '../../constants';
import { UseDto } from '../../decorators';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import type { IUserSettingsEntity } from './user-settings.entity';
import { UserSettingsEntity } from './user-settings.entity';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  address?: string;

  name?: string;

  level?: SeniorityType;

  email?: string;

  password?: string;

  avatar?: string;

  timezone?: string;

  settings?: IUserSettingsEntity;
}

@Entity({ name: 'user' })
@UseDto(UserDto)
export class UserEntity
  extends AbstractEntity<UserDto, UserDtoOptions>
  implements IUserEntity {
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true, type: 'enum', enum: SeniorityType, default: null })
  level: SeniorityType;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @ManyToMany(() => TeamEntity, (postEntity) => postEntity.members)
  teams: TeamEntity[];
}
