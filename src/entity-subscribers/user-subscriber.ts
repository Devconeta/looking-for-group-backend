import { IPFSClientService } from '../shared/services/ipfs.service';

import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { UserEntity } from '../modules/user/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(private ipfs: IPFSClientService) { }

  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    if (event.entity.avatar) {
      event.entity.avatar = await this.ipfs.upload(event.entity.avatar);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    if (!event.entity)
      return;

    if (event.entity.avatar) {
      event.entity.avatar = await this.ipfs.upload(event.entity.avatar);
    }
  }
}
