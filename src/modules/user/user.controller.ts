import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { UserRole } from '../../constants/user-role';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import { TranslationService } from '../../shared/services/translation.service';
import { UserDto } from './dtos/user.dto';
import { UserCreateDto } from './dtos/UserCreateDto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) { }

  @Get('admin')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${user.name}`,
    };
  }

  @Put(':address')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a user\'s data',
    type: UserEntity,
  })
  updateUser(
    @Param('address') address: string, @Body() userDto: UserDto
  ): Promise<UserEntity | null> {
    return this.userService.updateUser(address, userDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get user roles list',
    type: Array<string>,
  })
  getRoles(): string[] {
    return Object.values(UserRole);
  }

  @Get(':address')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@Param('address') address: string): Promise<UserDto> {
    return this.userService.getOrCreateUser(address);
  }
}
