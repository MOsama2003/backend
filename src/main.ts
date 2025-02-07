import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // Correct import
import serverless from 'serverless-http'; // Correct import

// Create an Express instance
const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);

  // Enable JWT Auth Guard globally
  app.useGlobalGuards(new JwtAuthGuard());

  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('AgriSense')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.init();

  // Return the serverless-compatible handler
  return serverless(expressApp);
}

// Export the handler for Vercel
export const handler = bootstrap();