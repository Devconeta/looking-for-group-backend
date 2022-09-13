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

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    // FIXME check event.databaseEntity.password
    const entity = event.entity as UserEntity;

    // if (entity.password !== event.databaseEntity.password) {
    //   entity.password = generateHash(entity.password!);
    // }
  }
}
