import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalGuards(new JwtAuthGuard());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('AgriSense')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });

  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
    customfavIcon: 'https://swagger.io/favicon-32x32.png',
    customSiteTitle: 'AgriSense API Docs',
    swaggerOptions: {
      dom_id: '#swagger-ui',
      url: 'https://agrisense-wheat.vercel.app/api/docs-json', // Replace with your API URL
      presets: [
        'SwaggerUIBundle.presets.apis',
        'SwaggerUIStandalonePreset'
      ],
      layout: 'BaseLayout',
      deepLinking: true
    }
  });

  return server; // Important for Vercel
}

export default bootstrap();
