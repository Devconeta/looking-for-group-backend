import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSettingsHandler } from './commands/create-settings.command';
import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { TeamSettingsRepository } from './team-settings.repository';

export const handlers = [CreateSettingsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository, TeamSettingsRepository])],
  controllers: [TeamController],
  exports: [TeamService],
  providers: [TeamService, ...handlers],
})
export class TeamModule {}
