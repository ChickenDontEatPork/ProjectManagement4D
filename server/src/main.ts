import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env: ConfigService = app.get(ConfigService);
  const whitelist = env.get<string>('whitelist').split(',');
  const nodeEnv = env.get<string>('NODE_ENV');
  const port = env.get<number>('port');
  app.enableCors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Sorry, you are not allowed to join the party!'));
      }
    },
    optionsSuccessStatus: 200,
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'],
  });
  if (nodeEnv === undefined || nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('ProjectManagement')
      .setDescription('')
      .setVersion('1.0')
      .addTag('')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
  }
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.use(compression());
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: false }));
  await app.listen(port);
}
bootstrap();
