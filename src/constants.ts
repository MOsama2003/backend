export const CONSTANTS = {
    ROLE: {
        ADMIN: "admin",
        FARMER: "farmer",
        COUNSELLAR: "counsellar"
    },
    BY_PASS_ROLE: ['/auth/login','/sensor-data','/sensor-location-data','/requested-counsellar','/user/register-non-device-owner',
        '/auth/forgot-password', '/auth/verify-otp', '/auth/reset-password'
    ]
}

export enum PostReaction {
    Upvote = "Upvote",
    Devote = "Devote",
    NoReaction = "NoReaction",
  }
  