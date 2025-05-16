"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
exports.CloudinaryProvider = {
    provide: 'CLOUDINARY',
    inject: [config_1.ConfigService],
    useFactory: () => {
        return cloudinary_1.v2.config({
            cloud_name: "dgb5ibjr5",
            api_key: "745113311429653",
            api_secret: "o2gV5G78WLvt8Um-KCxvaxv6aJ8",
        });
    },
};
//# sourceMappingURL=cloudinary.provider.js.map