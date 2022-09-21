import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiServicesModule } from '../../api-services/api-services.module';
import { UserTeamSettingsEntity } from './user-team-settings.entity';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserTeamSettingsEntity]), ApiServicesModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule { }
