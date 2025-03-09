import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ConfigService } from '@nestjs/config';
import path from 'path';

async function bootstrap() {
  const server = express(); // ✅ Use correct syntax
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; // Default to 3000 if not set

  // Enable JWT Auth Guard globally
  app.useGlobalGuards(new JwtAuthGuard());

  // Enable CORS
  app.enableCors();

  // Serve Swagger UI Assets Manually
  app.use('/swagger-ui', express.static(path.join(__dirname, '../public/swagger-ui')));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('AgriSense')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true
  });

  SwaggerModule.setup('api/docs', app, document, {
    customJs: '/swagger-ui/swagger-ui-bundle.js',
    customCssUrl: '/swagger-ui/swagger-ui.min.css',
  });

  await app.listen(port, '0.0.0.0').then(() => 
    console.log(`App is working on http://localhost:${port}/api/docs`)
  );
}

bootstrap();
