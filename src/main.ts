import { ClassSerializerInterceptor, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import type { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import { existsSync, readFileSync } from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

import * as http from 'http';
import * as https from 'https';

export async function bootstrap(): Promise<NestExpressApplication> {
  const server = express();
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    { cors: true },
  );
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  await app.init();

  const crPath = '/etc/letsencrypt/live/mechabrawlers.online/fullchain.pem';
  const pkPath = '/etc/letsencrypt/live/mechabrawlers.online/privkey.pem';

  if (existsSync(crPath) && existsSync(pkPath)) {

    https.createServer({
      key: readFileSync(pkPath),
      cert: readFileSync(crPath)
    }, server).listen(3443);
  }

  const port = configService.appConfig.port;
  http.createServer(server).listen(port);


  console.info(`server running on port ${port}`);

  return app;
}

void bootstrap();
