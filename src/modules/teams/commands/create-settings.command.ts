import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { CreateSettingsDto } from '../dtos/create-settings.dto';
import type { TeamSettingsEntity } from '../team-settings.entity';
import { TeamSettingsRepository } from '../team-settings.repository';

export class CreateSettingsCommand implements ICommand {
  constructor(
    public readonly teamId: Uuid,
    public readonly createSettingsDto: CreateSettingsDto,
  ) {}
}

@CommandHandler(CreateSettingsCommand)
export class CreateSettingsHandler
  implements ICommandHandler<CreateSettingsCommand, TeamSettingsEntity>
{
  constructor(private teamSettingsRepository: TeamSettingsRepository) {}

  async execute(command: CreateSettingsCommand) {
    const { teamId, createSettingsDto } = command;
    const teamSettingsEntity =
      this.teamSettingsRepository.create(createSettingsDto);

    teamSettingsEntity.teamId = teamId;

    return this.teamSettingsRepository.save(teamSettingsEntity);
  }
}
