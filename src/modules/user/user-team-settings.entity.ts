import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserRole } from '../../constants/user-role';
import { UseDto } from '../../decorators';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_team_settings' })
@UseDto(UserDto)
export class UserTeamSettingsEntity
  extends AbstractEntity<UserDto, UserDtoOptions>{
    @Column({ nullable: true, type: 'enum', enum: UserRole })
    role?: UserRole;

    @Column({ nullable: true })
    percentage?: number;

    @Column({ nullable: true })
    idea?: string;

    @Column({ default: false })
    consensus?: boolean;

    @Column({ default: false })
    isTeamLead: boolean;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.userTeamSettings)
    user: UserEntity;
}
