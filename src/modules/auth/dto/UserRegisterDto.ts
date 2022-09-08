import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transform.decorators';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  @Trim()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  readonly password: string;
}
