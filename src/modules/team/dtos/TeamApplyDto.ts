import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TeamApplyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly address: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly teamId: string
}
