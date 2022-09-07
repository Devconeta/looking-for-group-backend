import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';

import type { FindOptionsWhere } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException, TeamNotFoundException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { ValidatorService } from '../../shared/services/validator.service';
import { TeamRegisterDto } from '../auth/dto/TeamRegisterDto';
import { CreateSettingsCommand } from './commands/create-settings.command';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import type { TeamDto } from './dtos/team.dto';
import type { TeamsPageOptionsDto } from './dtos/teams-page-options.dto';
import type { TeamEntity } from './team.entity';
import { TeamRepository } from './team.repository';
import type { TeamSettingsEntity } from './team-settings.entity';

@Injectable()
export class TeamService {
    constructor(
        private teamRepository: TeamRepository,
        private validatorService: ValidatorService,
        private commandBus: CommandBus,
    ) {}

    /**
     * Find single team
     */
    findOne(findData: FindOptionsWhere<TeamEntity>): Promise<TeamEntity | null> {
        return this.teamRepository.findOneBy(findData);
    }

    async findByTeamnameOrEmailOrWallet(
        options: Partial<{ teamname: string; email: string; wallet: string }>,
    ): Promise<TeamEntity | null> {
        const queryBuilder = this.teamRepository
            .createQueryBuilder('team')
            .leftJoinAndSelect<TeamEntity, 'team'>('team.settings', 'settings');

        if (options.email) {
            queryBuilder.orWhere('team.email = :email', {
                email: options.email,
            });
        }

        if (options.teamname) {
            queryBuilder.orWhere('team.teamname = :teamname', {
                teamname: options.teamname,
            });
        }

        if (options.teamname) {
            queryBuilder.orWhere('team.wallet = :wallet', {
                wallet: options.wallet,
            });
        }

        return queryBuilder.getOne();
    }

    @Transactional()
    async createTeam(
        teamRegisterDto: TeamRegisterDto,
        file: IFile,
    ): Promise<TeamEntity> {
        const team = this.teamRepository.create(teamRegisterDto);

        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        await this.teamRepository.save(team);

        team.settings = await this.createSettings(
            team.id,
            plainToClass(CreateSettingsDto, {
                isEmailVerified: false,
                isPhoneVerified: false,
            }),
        );

        return team;
    }

    async getTeams(
        pageOptionsDto: TeamsPageOptionsDto,
    ): Promise<PageDto<TeamDto>> {
        const queryBuilder = this.teamRepository.createQueryBuilder('team');
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

        return items.toPageDto(pageMetaDto);
    }

    async getTeam(teamId: Uuid): Promise<TeamDto> {
        const queryBuilder = this.teamRepository.createQueryBuilder('team');

        queryBuilder.where('team.id = :teamId', { teamId });

        const teamEntity = await queryBuilder.getOne();

        if (!teamEntity) {
            throw new TeamNotFoundException();
        }

        return teamEntity.toDto();
    }

    async createSettings(
        teamId: Uuid,
        createSettingsDto: CreateSettingsDto,
    ): Promise<TeamSettingsEntity> {
        return this.commandBus.execute<CreateSettingsCommand, TeamSettingsEntity>(
            new CreateSettingsCommand(teamId, createSettingsDto),
        );
    }
}
