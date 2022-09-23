import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { SocialLink } from '../../../interfaces/SocialLink';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { SeniorityType, TeamTags } from '../../../constants';
import { UserRole } from '../../../constants/user-role';

import type { UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;
export class UserDto extends AbstractDto {
  @ApiProperty()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsString()
  cover?: string;

  @ApiPropertyOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsString()
  idea?: string;

  @ApiPropertyOptional()
  @IsArray()
  socialLinks?: SocialLink[];

  @ApiPropertyOptional({ enum: SeniorityType })
  level?: SeniorityType;

  @ApiPropertyOptional({ enum: UserRole })
  roles?: UserRole[];

  @ApiPropertyOptional({ enum: TeamTags })
  tags?: TeamTags[];

  @ApiPropertyOptional()
  @IsBoolean()
  alreadyEdited: boolean;

  constructor(user: UserEntity) {
    super(user);
    this.address = user.address;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.cover = user.cover;
    this.timezone = user.timezone;
    this.idea = user.idea;
    this.level = user.level;
    this.socialLinks = user.socialLinks;
    this.roles = user.roles;
    this.tags = user.tags;
    this.alreadyEdited = user.alreadyEdited;
  }
}
