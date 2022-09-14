import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { UserTeamSettingsEntity } from './user-team-settings.entity';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserTeamSettingsEntity])],
  controllers: [UserController],
  exports: [UserService, UserSubscriber],
  providers: [UserService, UserSubscriber],
})
export class UserModule { }
