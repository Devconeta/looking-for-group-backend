import { EntityRepository, Repository } from 'typeorm';

import { TeamSettingsEntity } from './team-settings.entity';

@EntityRepository(TeamSettingsEntity)
export class TeamSettingsRepository extends Repository<TeamSettingsEntity> {}
