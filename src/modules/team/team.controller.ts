import { PageDto } from '../../common/dto/page.dto';
import { TeamTags } from '../../constants';
import { ApiPageOkResponse } from '../../decorators';
import { TeamDto } from './dtos/team.dto';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamJoinDto } from './dtos/TeamJoinDto';
import { TeamEntity } from './team.entity';
import { TeamService } from './team.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamApplyDto } from './dtos/TeamApplyDto';

@Controller('teams')
@ApiTags('teams')
export class TeamController {
    constructor(
        private teamService: TeamService
    ) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create new team',
        type: TeamDto,
    })
    createTeam(@Body() teamPostDto: TeamCreateDto): Promise<Partial<TeamEntity> & { inviteUrl: string }> {
        return this.teamService.createTeam(teamPostDto)
    }

    @Post('join')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Join a team',
        type: TeamDto,
    })
    joinTeam(@Body() body: TeamJoinDto): Promise<TeamDto | null> {
        return this.teamService.joinTeam(body.address, body.code)
    }

    @Post('apply')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Apply to a team',
        type: TeamDto,
    })
    applyTeam(@Body() body: TeamApplyDto): Promise<TeamDto | null> {
        try {
            return this.teamService.applyTeam(body.address, body.teamId)
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    @Post('accept')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Accept an application',
        type: TeamDto,
    })
    acceptApplication(@Body() body: TeamApplyDto): Promise<TeamDto | null> {
        return this.teamService.acceptApplication(body.address, body.teamId)
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update a team\'s data',
        type: TeamDto,
    })
    updateTeam(@Param('id') id: string, @Body() teamDto: TeamCreateDto): Promise<TeamDto | null> {
        return this.teamService.updateTeam(id, teamDto)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
        description: 'Get teams list',
        type: PageDto,
    })
    @ApiQuery({
        name: "address",
        type: String,
        description: "User address. Optional",
        required: false
    })
    @ApiQuery({
        name: "search",
        type: String,
        description: "Search query. Optional. Search by team name, wallet, user name, wallet",
        required: false
    })
    getTeams(
        @Query('address') address?: string,
        @Query('search') search?: string,
    ): Promise<TeamEntity[]> {
        return this.teamService.getTeams(address, search);
    }

    @Get('tags')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
        description: 'Get teams tags list',
        type: PageDto,
    })
    getTeamTags(): string[] {
        return Object.values(TeamTags);
    }
}
