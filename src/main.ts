import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // ✅ Ensure correct import

async function bootstrap() {
  const server = express(); // ✅ Use correct syntax
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable JWT Auth Guard globally
  app.useGlobalGuards(new JwtAuthGuard());

  // Enable CORS
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('AgriSense')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000).then(()=>console.log('App is working on 3000'))
}

bootstrap();
