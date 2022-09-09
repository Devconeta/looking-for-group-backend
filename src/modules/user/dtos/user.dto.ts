import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { SeniorityType } from '../../../constants';

import type { UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;
export class UserDto extends AbstractDto {
  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ enum: SeniorityType })
  level?: SeniorityType;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.address = user.address;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.level = user.level;
    this.timezone = user.timezone;
    this.isActive = options?.isActive;
  }
}
