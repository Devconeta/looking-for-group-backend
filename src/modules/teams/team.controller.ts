import { Controller, Get, HttpCode, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import { TranslationService } from '../../shared/services/translation.service';
import { TeamsPageOptionsDto } from './dtos/team-page-options.dto';
import { TeamDto } from './dtos/team.dto';
import { TeamEntity } from './team.entity';
import { TeamService } from './team.service';

@Controller('teams')
@ApiTags('teams')
export class TeamController {
  constructor(
    private teamService: TeamService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('admin')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() team: TeamEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${team.firstName}`,
    };
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get teams list',
    type: PageDto,
  })
  getTeams(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TeamsPageOptionsDto,
  ): Promise<PageDto<TeamDto>> {
    return this.teamService.getTeams(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER])
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
