import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { UserEntity } from 'modules/user/user.entity';

import { Trim } from '../../../decorators/transform.decorators';

export class TeamCreateDto {
  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly idea: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly avatar: string;

  @ApiProperty()
  @Column()
  @IsBoolean()
  @IsOptional()
  readonly isPublic: boolean;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly slogan: string;

  members: UserEntity[];
}
