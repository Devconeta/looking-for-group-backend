import { Injectable } from '@nestjs/common';

import type { FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private validatorService: ValidatorService,
  ) { }

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  @Transactional()
  async updateUser(
    address: string,
    userDto: UserDto
  ): Promise<UserEntity | null> {
    await this.userRepository.update({ address }, userDto);
    return this.userRepository.findOne({ where: { address } });
  }

  @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    await this.userRepository.save(user);

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    return {
      data: users,
      meta: {
        page: pageOptionsDto.page,
        pageCount: Math.ceil(total / pageOptionsDto.take),
        itemCount: users.length,
        hasPreviousPage: pageOptionsDto.page > 1,
        hasNextPage: pageOptionsDto.page < Math.ceil(total / pageOptionsDto.take),
        take: pageOptionsDto.take,
      },
    }
  }


  async getOrCreateUser(address: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { address } });

    if (!user) {
      return this.createUser({ address } as UserRegisterDto);
    }

    return user.toDto();
  }
}
