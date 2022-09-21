import { IPFSClientService } from '../shared/services/ipfs.service';

import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { UserEntity } from '../modules/user/user.entity';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { fromString } from 'uint8arrays/from-string'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  private client: IPFSHTTPClient;

  constructor() {
    this.client = create()
  }

  public async upload(base64_string: string): Promise<string> {
    const data = fromString(base64_string, 'base64')
    const { cid } = await this.client.add(data)
    return `https://cloudflare-ipfs.com/ipfs/${cid}`
  }

  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    if (!event.entity)
      return;

    if (event.entity.avatar) {
      event.entity.avatar = await this.upload(event.entity.avatar);
    }

    if (event.entity.cover) {
      event.entity.cover = await this.upload(event.entity.cover);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    if (!event.entity)
      return;

    if (event.entity.avatar) {
      event.entity.avatar = await this.upload(event.entity.avatar);
    }

    if (event.entity.cover) {
      event.entity.cover = await this.upload(event.entity.cover);
    }
  }
}
