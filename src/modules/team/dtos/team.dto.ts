import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoinTable, ManyToMany } from 'typeorm';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AssetDistributionMethods, TeamTags, UserRole } from '../../../constants';
import { UserEntity } from '../../../modules/user/user.entity';

import type { TeamEntity } from '../team.entity';

export class TeamDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  idea?: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @ApiPropertyOptional()
  avatar?: string;

  @ApiProperty({ default: false })
  isPublic: boolean;

  @ApiPropertyOptional({ enum: AssetDistributionMethods })
  distribution?: AssetDistributionMethods;

  @ApiPropertyOptional()
  maxMembers?: number;

  @ApiPropertyOptional()
  contractAddress?: string;

  @ApiPropertyOptional()
  isContractDeployed?: boolean;

  @ApiPropertyOptional()
  code?: string;

  @ApiPropertyOptional({ enum: TeamTags })
  tags?: TeamTags[];

  @ApiPropertyOptional({ enum: UserRole })
  lookingFor?: UserRole[];

  @ApiPropertyOptional()
  slogan?: string;

  constructor(team: TeamEntity) {
    super(team);
    this.name = team.name;
    this.idea = team.idea;
    this.members = team.members;
    this.distribution = team.distribution;
    this.isPublic = team.isPublic;
    this.avatar = team.avatar;
    this.maxMembers = team.maxMembers;
    this.contractAddress = team.contractAddress;
    this.tags = team.tags;
    this.lookingFor = team.lookingFor;
    this.isContractDeployed = team.isContractDeployed;
    this.code = team.code;
  }
}
