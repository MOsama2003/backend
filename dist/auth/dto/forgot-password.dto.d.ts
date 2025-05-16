export declare class ForgotPasswordUserDto {
    email: string;
}
export declare class OTPDto {
    otp: string;
    email: string;
}
export declare class ResetPasswordUserDto {
    email: string;
    otp: string;
    newPassword: string;
}
