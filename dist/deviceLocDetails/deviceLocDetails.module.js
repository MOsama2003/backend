"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceLocDetailsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../user/user.module");
const deviceLocDetails_service_1 = require("./deviceLocDetails.service");
const deviceLocDetails_entity_1 = require("./entities/deviceLocDetails.entity");
const deviceLocDetails_controller_1 = require("./deviceLocDetails.controller");
let DeviceLocDetailsModule = class DeviceLocDetailsModule {
};
exports.DeviceLocDetailsModule = DeviceLocDetailsModule;
exports.DeviceLocDetailsModule = DeviceLocDetailsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([deviceLocDetails_entity_1.DeviceLocDetails]), user_module_1.UserModule],
        controllers: [deviceLocDetails_controller_1.DeviceLocDetailsController],
        providers: [deviceLocDetails_service_1.DeviceLocDetailsService],
    })
], DeviceLocDetailsModule);
//# sourceMappingURL=deviceLocDetails.module.js.map