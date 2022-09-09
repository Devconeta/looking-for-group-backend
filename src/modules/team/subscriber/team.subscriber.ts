import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { TeamEntity } from "../team.entity";

@EventSubscriber()
export class TeamSubscriber implements EntitySubscriberInterface<TeamEntity> {
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


  async beforeInsert(event: InsertEvent<TeamEntity>): Promise<any> {
    event.entity.code = this.makeId(6)
  }
}
