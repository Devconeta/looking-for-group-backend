import { IPFSClientService } from '../shared/services/ipfs.service';

import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { TeamEntity } from 'modules/team/team.entity';

@EventSubscriber()
export class TeamSubscriber implements EntitySubscriberInterface<TeamEntity> {
  constructor(private ipfs: IPFSClientService) {
  }

  listenTo(): typeof TeamEntity {
    return TeamEntity;
  }


}
