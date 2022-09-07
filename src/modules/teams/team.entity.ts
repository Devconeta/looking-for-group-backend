import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto, VirtualColumn } from '../../decorators';
import { PostEntity } from '../post/post.entity';
import type { TeamDtoOptions } from './dtos/team.dto';
import { TeamDto } from './dtos/team.dto';
import type { ITeamSettingsEntity } from './team-settings.entity';
import { TeamSettingsEntity } from './team-settings.entity';

export interface ITeamEntity extends IAbstractEntity<TeamDto> {
    wallet?: string;

    firstName?: string;

    lastName?: string;

    role: RoleType;

    email?: string;

    password?: string;

    phone?: string;

    avatar?: string;

    fullName?: string;

    settings?: ITeamSettingsEntity;
}

@Entity({ name: 'teams' })
@UseDto(TeamDto)
export class TeamEntity
    extends AbstractEntity<TeamDto, TeamDtoOptions>
    implements ITeamEntity {
    @Column({ nullable: true })
    wallet?: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: true })
    email?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    avatar?: string;

    @VirtualColumn()
    fullName?: string;

    @OneToOne(() => TeamSettingsEntity, (teamSettings) => teamSettings.team)
    settings?: TeamSettingsEntity;

    @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
    posts: PostEntity[];
}
