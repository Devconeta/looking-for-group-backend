import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IPFSClientService } from '../../shared/services/ipfs.service';
import { UserTeamSettingsEntity } from './user-team-settings.entity';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserTeamSettingsEntity])],
  controllers: [UserController],
  exports: [UserService, IPFSClientService],
  providers: [UserService, IPFSClientService],
})
export class UserModule { }
