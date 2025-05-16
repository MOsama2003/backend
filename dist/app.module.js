"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const sensorData_module_1 = require("./sensorData/sensorData.module");
const deviceLocDetails_module_1 = require("./deviceLocDetails/deviceLocDetails.module");
const requested_counsellar_module_1 = require("./requested-counsellar/requested-counsellar.module");
const redis_module_1 = require("./redis/redis.module");
const blog_module_1 = require("./blog/blog.module");
const feed_module_1 = require("./feed/feed.module");
const sensor_based_event_and_task_mgt_module_1 = require("./sensor-based-event-and-task-mgt/sensor-based-event-and-task-mgt.module");
const notifications_module_1 = require("./notifications/notifications.module");
const appointment_module_1 = require("./appointment/appointment.module");
const consult_ai_chat_module_1 = require("./consult-ai-chat/consult-ai-chat.module");
const conversation_module_1 = require("./conversation/conversation.module");
const stripe_module_1 = require("./stripe/stripe.module");
const stream_module_1 = require("./stream/stream.module");
const schedule_1 = require("@nestjs/schedule");
const farm_module_1 = require("./farm-task-advisory/farm.module");
const axios_1 = require("@nestjs/axios");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    ssl: { rejectUnauthorized: false },
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: true,
                    entities: [__dirname + "/**/*.entity{.ts,.js}"]
                }),
            }),
            axios_1.HttpModule,
            schedule_1.ScheduleModule.forRoot(),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            cloudinary_module_1.CloudinaryModule,
            sensorData_module_1.SensorDataModule,
            deviceLocDetails_module_1.DeviceLocDetailsModule,
            requested_counsellar_module_1.RequestedCounsellarModule,
            redis_module_1.RedisModule,
            blog_module_1.BlogModule,
            feed_module_1.FeedModule,
            appointment_module_1.AppointmentModule,
            consult_ai_chat_module_1.ConsultAiChatModule,
            sensor_based_event_and_task_mgt_module_1.SensorBasedEventAndTaskMgtModule,
            notifications_module_1.NotificationsModule,
            conversation_module_1.ConversationModule,
            notifications_module_1.NotificationsModule,
            stripe_module_1.StripeModule,
            stream_module_1.StreamModule,
            farm_module_1.FarmModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map