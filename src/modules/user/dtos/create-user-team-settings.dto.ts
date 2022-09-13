import { ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '../../../constants/user-role';
import { BooleanFieldOptional } from '../../../decorators';

export class CreateUserTeamSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified: boolean;

  @ApiPropertyOptional({ enum: UserRole })
  lookingFor?: UserRole[];

  @ApiPropertyOptional()
  percentage?: number;

  @ApiPropertyOptional()
  idea?: string;

  @ApiPropertyOptional()
  consensus?: boolean;

  @ApiPropertyOptional()
  isTeamLead: boolean;
}
