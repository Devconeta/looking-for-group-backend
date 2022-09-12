import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { SeniorityType } from '../../../constants';
import { UserRole } from '../../../constants/user-role';

import type { UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;
export class UserDto extends AbstractDto {
    @ApiProperty()
    address: string;
    
    @ApiPropertyOptional()
    name?: string;
  
    @ApiPropertyOptional()
    email?: string;
  
    @ApiPropertyOptional()
    password?: string;
  
    @ApiPropertyOptional()
    avatar?: string;
  
    @ApiPropertyOptional()
    timezone?: string;
  
    @ApiPropertyOptional({ enum: SeniorityType })
    level?: SeniorityType;
  
    @ApiPropertyOptional()
    socialLinks?: string[];
  
    @ApiPropertyOptional({ enum: UserRole })
    role?: UserRole;
  

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.address = user.address;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.avatar = user.avatar;
    this.timezone = user.timezone;
    this.level = user.level;
    this.socialLinks = user.socialLinks;
    this.role = user.role;
  }
}
