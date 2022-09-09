import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { ApiPageOkResponse, UUIDParam } from '../../decorators';
import { TeamDto } from './dtos/team.dto';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamEntity } from './team.entity';
import { TeamService } from './team.service';

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
  createTeam(@Body() teamPostDto: TeamCreateDto): Promise<TeamDto> {
    return this.teamService.createTeam(teamPostDto)
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create new team',
    type: TeamDto,
  })
  joinTeam(@Body() body: { address: string, code: string }): Promise<TeamDto | null> {
    return this.teamService.joinTeam(body.address, body.code)
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a team\'s data',
    type: TeamDto,
  })
  updateTeam(@Body() teamDto: TeamDto): Promise<TeamDto | null> {
    return this.teamService.updateTeam(teamDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get teams list',
    type: PageDto,
  })
  getTeams(
    @Query('address') address: string
  ): Promise<TeamEntity[]> {
    return this.teamService.getTeams(address);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get teams list',
    type: TeamDto,
  })
  getTeam(@UUIDParam('id') teamId: Uuid): Promise<TeamDto> {
    return this.teamService.getTeam(teamId);
  }
}
