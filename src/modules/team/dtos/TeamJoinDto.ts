import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TeamJoinDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly address: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly code: string
}
