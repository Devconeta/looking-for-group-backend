import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transform.decorators';

export class UserRegisterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly wallet: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Trim()
    readonly firstName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Trim()
    readonly lastName: string;

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

    @ApiProperty()
    @Column()
    @IsPhoneNumber()
    @IsOptional()
    phone: string;
}
