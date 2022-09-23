import { create, IPFSHTTPClient } from "ipfs-http-client";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { fromString } from 'uint8arrays/from-string'

import { TeamEntity } from "../team.entity";

@EventSubscriber()
export class TeamSubscriber implements EntitySubscriberInterface<TeamEntity> {
  private client: IPFSHTTPClient;

  constructor() {
    this.client = create()
  }

  public async upload(base64_string: string): Promise<string> {
    const data = fromString(base64_string, 'base64')
    const { cid } = await this.client.add(data)
    return `https://cloudflare-ipfs.com/ipfs/${cid}`
  }

  listenTo() {
    return TeamEntity;
  }

  makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }


  async beforeInsert(event: InsertEvent<TeamEntity>): Promise<void> {
    if (!event.entity)
      return;

    event.entity.code = this.makeId(6)

    if (event.entity.avatar && !event.entity.avatar.startsWith('https')) {
      event.entity.avatar = await this.upload(event.entity.avatar);
    }
  }

  async beforeUpdate(event: UpdateEvent<TeamEntity>): Promise<void> {
    if (!event.entity)
      return;

    if (event.entity.avatar && !event.entity.avatar.startsWith('https')) {
      event.entity.avatar = await this.upload(event.entity.avatar);
    }
  }
}
