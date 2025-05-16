"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_guard_1 = require("./auth/guards/jwt.guard");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const config_1 = require("@nestjs/config");
const path_1 = __importDefault(require("path"));
async function bootstrap() {
    const server = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    app.useGlobalGuards(new jwt_guard_1.JwtAuthGuard());
    app.enableCors();
    app.use('/swagger-ui', express_1.default.static(path_1.default.join(__dirname, '../public/swagger-ui')));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AgriSense')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true
    });
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customJs: '/swagger-ui/swagger-ui-bundle.js',
        customCssUrl: '/swagger-ui/swagger-ui.min.css',
    });
    await app.listen(port, '0.0.0.0').then(() => console.log(`App is working on http://localhost:${port}/api/docs`));
}
bootstrap();
//# sourceMappingURL=main.js.map