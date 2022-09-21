import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiServicesModule } from '../../api-services/api-services.module';
import { TeamSubscriber } from '../../entity-subscribers/team-subscriber';
import { UserModule } from '../../modules/user/user.module';
import { TeamController } from './team.controller';
import { TeamEntity } from './team.entity';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), UserModule, ApiServicesModule],
  controllers: [TeamController],
  exports: [TeamService, TeamSubscriber],
  providers: [TeamService, TeamSubscriber],
})
export class TeamModule { }
