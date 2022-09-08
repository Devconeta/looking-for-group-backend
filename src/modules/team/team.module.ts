import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository])],
  controllers: [TeamController],
  exports: [TeamService],
  providers: [TeamService],
})
export class TeamModule { }
