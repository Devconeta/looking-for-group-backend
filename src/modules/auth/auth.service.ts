/* eslint-disable simple-import-sort/imports */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';

import { TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import type { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) { }

  async createAccessToken(data: {
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN
      }),
    });
  }

  async createTemporalAccessToken(data: {
    nonce: number;
    address: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: 120,
      accessToken: await this.jwtService.signAsync(
        {
          ...data,
          type: TokenType.TEMPORAL_TOKEN,
        },
        { expiresIn: '120s' },
      ),
    });
  }

  // async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
  //   const user = await this.userService.findOne({
  //     email: userLoginDto.email,
  //   });

  //   const isPasswordValid = await validateHash(
  //     userLoginDto.password,
  //     user?.password,
  //   );

  //   if (!isPasswordValid) {
  //     throw new UserNotFoundException();
  //   }

  //   return user!;
  // }
}
