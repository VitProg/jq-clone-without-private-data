import { swaggerDaskCss } from './swagger/swagger-dark.css'


require('dotenv').config()
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NextFunction, Request, Response } from 'express'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'


async function bootstrap () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe());

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('x-powered-by', 'JQ NestJs Server')
    next()
  })

  app.setGlobalPrefix('api')

  app.use(cookieParser());

  // swagger
  const options = new DocumentBuilder()
    .setTitle('JQ')
    .setDescription('jq form api')
    .setVersion('1.0')
    // .addTag('forum')
    // .addTag('community')
    .addBasicAuth({ type: 'http', in: 'query'})
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },)
    .addCookieAuth(process.env.JWT_REFRESH_TOKEN_COOKIE, undefined, 'refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    customCss: swaggerDaskCss
  });
  // -

  await app.listen(3000)
}

bootstrap()
