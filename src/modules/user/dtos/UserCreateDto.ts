import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { SeniorityType, TeamTags, UserRole } from '../../../constants';
import { Trim } from '../../../decorators/transform.decorators';

export class UserCreateDto {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // readonly address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly timezone: string;

  @ApiPropertyOptional({ enum: SeniorityType })
  @IsOptional()
  @IsEnum(SeniorityType)
  readonly level: SeniorityType;

  @ApiPropertyOptional({ enum: UserRole, isArray: true, type: Array })
  @IsOptional()
  @IsArray()
  readonly roles?: UserRole[];

  @ApiPropertyOptional({ enum: TeamTags, isArray: true, type: Array })
  @IsOptional()
  @IsArray()
  readonly tags?: TeamTags[];
}