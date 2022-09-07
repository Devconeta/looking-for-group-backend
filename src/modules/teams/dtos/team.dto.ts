import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';

import type { TeamEntity } from '../team.entity';

// TODO, remove this class and use constructor's second argument's type
export type TeamDtoOptions = Partial<{ isActive: boolean }>;

export class TeamDto extends AbstractDto {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  teamname: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(team: TeamEntity, options?: TeamDtoOptions) {
    super(team);
    this.firstName = team.firstName;
    this.lastName = team.lastName;
    this.role = team.role;
    this.email = team.email;
    this.avatar = team.avatar;
    this.phone = team.phone;
    this.isActive = options?.isActive;
  }
}
