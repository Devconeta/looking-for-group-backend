import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../../modules/user/user.module';

import { TeamController } from './team.controller';
import { TeamEntity } from './team.entity';
import { TeamService } from './team.service';
import { ApiServicesModule } from '../../api-services/api-services.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), UserModule, ApiServicesModule],
  controllers: [TeamController],
  exports: [TeamService],
  providers: [TeamService],
})
export class TeamModule { }
