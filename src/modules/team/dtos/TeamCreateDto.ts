import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Column } from 'typeorm';

import { UserEntity } from 'modules/user/user.entity';

import { TeamTags, UserRole } from '../../../constants';
import { Trim } from '../../../decorators/transform.decorators';

export class TeamCreateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly idea: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly avatar: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Max(8)
  @Min(1)
  readonly maxMembers: number;

  @ApiPropertyOptional()
  @Column()
  @IsBoolean()
  @IsOptional()
  readonly isPublic: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly isContractDeployed: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly slogan: string;

  @ApiPropertyOptional({ enum: TeamTags, isArray: true, type: Array })
  @IsOptional()
  @IsArray()
  readonly tags?: TeamTags[];

  @ApiPropertyOptional({ enum: UserRole, isArray: true, type: Array })
  @IsOptional()
  @IsArray()
  readonly lookingFor?: UserRole[];

  members: UserEntity[];
}
