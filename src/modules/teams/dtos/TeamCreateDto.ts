import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

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
    readonly description: string;

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
}
