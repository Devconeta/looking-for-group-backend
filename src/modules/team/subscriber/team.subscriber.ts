import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";

import { IPFSClientService } from "../../../shared/services/ipfs.service";
import { TeamEntity } from "../team.entity";

@EventSubscriber()
export class TeamSubscriber implements EntitySubscriberInterface<TeamEntity> {

  constructor(private ipfs: IPFSClientService) {
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

    if (event.entity.avatar) {
      event.entity.avatar = await this.ipfs.upload(event.entity.avatar);
    }
  }

  async beforeUpdate(event: UpdateEvent<TeamEntity>): Promise<void> {
    if (!event.entity)
      return;

    if (event.entity.avatar) {
      event.entity.avatar = await this.ipfs.upload(event.entity.avatar);
    }
  }
}
