"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
const stream_chat_1 = require("stream-chat");
let StreamService = class StreamService {
    constructor() {
        this.serverClient = stream_chat_1.StreamChat.getInstance("dmv879kfq7fh", "p946xb2svrd4jjsth7xammsupm8bphyhttq4zg42vrqgeuuhy2ur6hdwg26j2ucj");
    }
    generateStreamToken(userId) {
        try {
            return this.serverClient.createToken(userId.toString());
        }
        catch (error) {
            throw new Error(`Failed to generate Stream token: ${error.message}`);
        }
    }
    async createStreamUser(user) {
        try {
            const streamUser = await this.serverClient.upsertUser({
                id: user.id.toString(),
                name: user.name,
                email: user.email,
            });
            return streamUser;
        }
        catch (error) {
            throw new Error(`Failed to create Stream user: ${error.message}`);
        }
    }
};
exports.StreamService = StreamService;
exports.StreamService = StreamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StreamService);
//# sourceMappingURL=stream.service.js.map