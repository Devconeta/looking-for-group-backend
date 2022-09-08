import { Controller, Get, HttpCode, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, UUIDParam } from '../../decorators';
import { TranslationService } from '../../shared/services/translation.service';
import { TeamDto } from './dtos/team.dto';
import { TeamsPageOptionsDto } from './dtos/teams-page-options.dto';
import { TeamService } from './team.service';

@Controller('teams')
@ApiTags('teams')
export class TeamController {
  constructor(
    private teamService: TeamService,
    private readonly translationService: TranslationService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get teams list',
    type: PageDto,
  })
  getTeams(
    @Query(new ValidationPipe({ transform: true }))
    @Query('address') address: string,
    pageOptionsDto: TeamsPageOptionsDto,
  ): Promise<PageDto<TeamDto>> {
    return this.teamService.getTeams(address, pageOptionsDto);
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
