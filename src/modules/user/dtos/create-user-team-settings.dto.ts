import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../constants/user-role';
import { BooleanFieldOptional, EnumFieldOptional } from '../../../decorators';

export class CreateUserTeamSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified: boolean;

  @ApiPropertyOptional({ enum: UserRole })
  role?: UserRole;

  @ApiPropertyOptional()
  percentage?: number;

  @ApiPropertyOptional()
  idea?: string;

  @ApiPropertyOptional()
  consensus?: boolean;

  @ApiPropertyOptional()
  isTeamLead: boolean;
}
