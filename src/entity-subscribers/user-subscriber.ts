import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { UserEntity } from '../modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../shared/services/api-config.service';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(private apiConfig: ApiConfigService) { }

  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    if (event.entity.avatar) {
      event.entity.avatar = await this.apiConfig.upload(event.entity.avatar);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    if (!event.entity)
      return;

    if (event.entity.avatar) {
      event.entity.avatar = await this.apiConfig.upload(event.entity.avatar);
    }
  }
}
