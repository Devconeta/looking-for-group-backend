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

    @Get('/timezones')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get timezone list',
        type: Array<String>,
    })
    getTimezones(): string[] {
        const timezones = [
            "(UTC-12:00) International Date Line West",
            "(UTC-11:00) Coordinated Universal Time-11",
            "(UTC-10:00) Hawaii",
            "(UTC-09:00) Alaska",
            "(UTC-08:00) Baja California",
            "(UTC-07:00) Pacific Daylight Time (US & Canada)",
            "(UTC-08:00) Pacific Standard Time (US & Canada)",
            "(UTC-07:00) Arizona",
            "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
            "(UTC-07:00) Mountain Time (US & Canada)",
            "(UTC-06:00) Central America",
            "(UTC-06:00) Central Time (US & Canada)",
            "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
            "(UTC-06:00) Saskatchewan",
            "(UTC-05:00) Bogota, Lima, Quito",
            "(UTC-05:00) Eastern Time (US & Canada)",
            "(UTC-04:00) Eastern Daylight Time (US & Canada)",
            "(UTC-05:00) Indiana (East)",
            "(UTC-04:30) Caracas",
            "(UTC-04:00) Asuncion",
            "(UTC-04:00) Atlantic Time (Canada)",
            "(UTC-04:00) Cuiaba",
            "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
            "(UTC-04:00) Santiago",
            "(UTC-03:30) Newfoundland",
            "(UTC-03:00) Brasilia",
            "(UTC-03:00) Buenos Aires",
            "(UTC-03:00) Cayenne, Fortaleza",
            "(UTC-03:00) Greenland",
            "(UTC-03:00) Montevideo",
            "(UTC-03:00) Salvador",
            "(UTC-02:00) Coordinated Universal Time-02",
            "(UTC-02:00) Mid-Atlantic - Old",
            "(UTC-01:00) Azores",
            "(UTC-01:00) Cape Verde Is.",
            "(UTC) Casablanca",
            "(UTC) Coordinated Universal Time",
            "(UTC) Edinburgh, London",
            "(UTC+01:00) Edinburgh, London",
            "(UTC) Dublin, Lisbon",
            "(UTC) Monrovia, Reykjavik",
            "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
            "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
            "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
            "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
            "(UTC+01:00) West Central Africa",
            "(UTC+01:00) Windhoek",
            "(UTC+02:00) Athens, Bucharest",
            "(UTC+02:00) Beirut",
            "(UTC+02:00) Cairo",
            "(UTC+02:00) Damascus",
            "(UTC+02:00) E. Europe",
            "(UTC+02:00) Harare, Pretoria",
            "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
            "(UTC+03:00) Istanbul",
            "(UTC+02:00) Jerusalem",
            "(UTC+02:00) Tripoli",
            "(UTC+03:00) Amman",
            "(UTC+03:00) Baghdad",
            "(UTC+02:00) Kaliningrad",
            "(UTC+03:00) Kuwait, Riyadh",
            "(UTC+03:00) Nairobi",
            "(UTC+03:00) Moscow, St. Petersburg, Volgograd, Minsk",
            "(UTC+04:00) Samara, Ulyanovsk, Saratov",
            "(UTC+03:30) Tehran",
            "(UTC+04:00) Abu Dhabi, Muscat",
            "(UTC+04:00) Baku",
            "(UTC+04:00) Port Louis",
            "(UTC+04:00) Tbilisi",
            "(UTC+04:00) Yerevan",
            "(UTC+04:30) Kabul",
            "(UTC+05:00) Ashgabat, Tashkent",
            "(UTC+05:00) Yekaterinburg",
            "(UTC+05:00) Islamabad, Karachi",
            "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
            "(UTC+05:30) Sri Jayawardenepura",
            "(UTC+05:45) Kathmandu",
            "(UTC+06:00) Nur-Sultan (Astana)",
            "(UTC+06:00) Dhaka",
            "(UTC+06:30) Yangon (Rangoon)",
            "(UTC+07:00) Bangkok, Hanoi, Jakarta",
            "(UTC+07:00) Novosibirsk",
            "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
            "(UTC+08:00) Krasnoyarsk",
            "(UTC+08:00) Kuala Lumpur, Singapore",
            "(UTC+08:00) Perth",
            "(UTC+08:00) Taipei",
            "(UTC+08:00) Ulaanbaatar",
            "(UTC+08:00) Irkutsk",
            "(UTC+09:00) Osaka, Sapporo, Tokyo",
            "(UTC+09:00) Seoul",
            "(UTC+09:30) Adelaide",
            "(UTC+09:30) Darwin",
            "(UTC+10:00) Brisbane",
            "(UTC+10:00) Canberra, Melbourne, Sydney",
            "(UTC+10:00) Guam, Port Moresby",
            "(UTC+10:00) Hobart",
            "(UTC+09:00) Yakutsk",
            "(UTC+11:00) Solomon Is., New Caledonia",
            "(UTC+11:00) Vladivostok",
            "(UTC+12:00) Auckland, Wellington",
            "(UTC+12:00) Coordinated Universal Time+12",
            "(UTC+12:00) Fiji",
            "(UTC+12:00) Magadan",
            "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
            "(UTC+13:00) Nuku'alofa",
            "(UTC+13:00) Samoa"
        ];
        return timezones;
    }
}
