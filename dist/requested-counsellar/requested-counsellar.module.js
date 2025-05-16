"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestedCounsellarModule = void 0;
const common_1 = require("@nestjs/common");
const requested_counsellar_service_1 = require("./requested-counsellar.service");
const requested_counsellar_controller_1 = require("./requested-counsellar.controller");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const mail_module_1 = require("../mail/mail.module");
const requested_counsellar_entity_1 = require("./entities/requested-counsellar.entity");
const typeorm_1 = require("@nestjs/typeorm");
let RequestedCounsellarModule = class RequestedCounsellarModule {
};
exports.RequestedCounsellarModule = RequestedCounsellarModule;
exports.RequestedCounsellarModule = RequestedCounsellarModule = __decorate([
    (0, common_1.Module)({
        controllers: [requested_counsellar_controller_1.RequestedCounsellarController],
        providers: [requested_counsellar_service_1.RequestedCounsellarService],
        imports: [typeorm_1.TypeOrmModule.forFeature([requested_counsellar_entity_1.RequestedCounsellar]), cloudinary_module_1.CloudinaryModule, mail_module_1.MailModule],
        exports: [requested_counsellar_service_1.RequestedCounsellarService, typeorm_1.TypeOrmModule]
    })
], RequestedCounsellarModule);
//# sourceMappingURL=requested-counsellar.module.js.map