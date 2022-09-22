import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { TeamNotFoundException, UserAlreadyAMemberException, UserNotFoundException } from '../../exceptions';
import { TeamCreateDto } from './dtos/TeamCreateDto';
import { TeamEntity } from './team.entity';
import { UserService } from '../../modules/user/user.service';
import { DiscordBotService } from '../../shared/services/discord-bot.service';
import { UserAlreadyAppliedException } from '../../exceptions/user-already-applied.exception';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>,
        private readonly userService: UserService,
        private discordService: DiscordBotService
    ) { }

    /**
     * Find single team
     */
    findOne(findData: FindOptionsWhere<TeamEntity>): Promise<TeamEntity | null> {
        return this.teamRepository.findOneBy(findData);
    }

    @Transactional()
    async createTeam(teamRegisterDto: TeamCreateDto): Promise<TeamEntity> {
        const user = await this.userService.findOne({ address: teamRegisterDto.address })
        user && (teamRegisterDto.members = [user])

        const team = this.teamRepository.create(teamRegisterDto);

        await this.teamRepository.save(team);

        if (team.isPublic) {
            this.discordService.createTeamChannels(team)
        }

        return team;
    }

    @Transactional()
    async updateTeam(id: string, teamDto: TeamCreateDto): Promise<TeamEntity | null> {

        const result = await this.teamRepository.createQueryBuilder()
            .update(teamDto)
            .where({
                id,
            })
            .returning('*')
            .execute()

        return result.raw[0]
    }

    async joinTeam(address: string, code: string): Promise<TeamEntity | null> {
        const team = await this.teamRepository.findOne({ where: { code }, relations: ['members', 'applicants'] });
        if (!team)
            throw new TeamNotFoundException();

        const user = await this.userService.findOne({ address })

        if (!user)
            throw new UserNotFoundException();

        if (team.members) {
            if (team.members.map(u => u.address).includes(user.address))
                throw new UserAlreadyAMemberException();
            else
                team.members.push(user)
        } else {
            team.members = [user]
        }

        return this.teamRepository.save(team);
    }

    async applyTeam(address: string, teamId: string): Promise<TeamEntity | null> {
        const team = await this.teamRepository.findOne({ where: { id: teamId } as any, relations: ['members', 'applicants'] });

        if (!team)
            throw new TeamNotFoundException();

        if (!team.isPublic)
            throw new TeamNotFoundException();

        const user = await this.userService.findOne({ address })

        if (!user)
            throw new UserNotFoundException();

        if (team.members && team.members.length > 0) {
            if (team.members.map(u => u.address).includes(user.address))
                throw new UserAlreadyAMemberException();
            else
                team.applicants.push(user)
        } else {
            team.applicants = [user]
        }

        console.log("CUANTOS SON", team.applicants)
        if (team.applicants && team.applicants.length > 0) {
            if (team.applicants.map(u => u.address).includes(user.address))
                throw new UserAlreadyAppliedException();
            else
                team.applicants.push(user)
        } else {
            team.applicants = [user]
        }


        return this.teamRepository.save(team);
    }

    async getTeams(address?: string, filters?: [{ tag: string, value: string }]): Promise<TeamEntity[]> {
        const options = {
            relations: ['members', 'applicants'],
        }

        if (filters) {
            options['where'] = filters;
        }

        if (address) {
            if (options['where']) {

                options['where'] = {
                    ...options['where'][0],
                    members: { address }
                }
            } else {
                options['where'] = {
                    members: { address }
                }
            }
        }

        return this.teamRepository.find(options);
    }
}
