import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import path from 'path';

import { ApiServicesModule } from './api-services/api-services.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { TeamModule } from './modules/team/team.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { DiscordBotService } from './shared/services/discord-bot.service';
import { IPFSClientService } from './shared/services/ipfs.service';
import { SharedModule } from './shared/shared.module';

import './boilerplate.polyfill';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TeamModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService]
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
    ApiServicesModule,
  ],
  exports: [DiscordBotService, IPFSClientService],
  providers: [DiscordBotService, IPFSClientService],
})
export class AppModule { }
