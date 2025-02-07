import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

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
}

bootstrap();

// ✅ Correct way to export the Vercel handler
export default (req: VercelRequest, res: VercelResponse) => {
  server(req, res); // Express handles the request
};
