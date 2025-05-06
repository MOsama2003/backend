import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const CloudinaryProvider: Provider = {
    provide: 'CLOUDINARY',
    inject: [ConfigService],
    useFactory: () => {
        return cloudinary.config({
            cloud_name: "dgb5ibjr5",
            api_key: "745113311429653",
            api_secret: "o2gV5G78WLvt8Um-KCxvaxv6aJ8",
        });
    },
};
