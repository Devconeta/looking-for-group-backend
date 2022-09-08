import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoinTable, ManyToMany } from 'typeorm';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserEntity } from '../../../modules/user/user.entity';

import type { TeamEntity } from '../team.entity';

export class TeamDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @ApiPropertyOptional()
  avatar?: string;

  @ApiProperty({ default: false })
  isPublic: boolean;

  constructor(team: TeamEntity) {
    super(team);
    this.name = team.name;
    this.description = team.description;
    this.members = team.members;
    this.isPublic = team.isPublic;
    this.avatar = team.avatar;
  }
}
