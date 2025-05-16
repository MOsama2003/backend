export declare class MailService {
    private transporter;
    constructor();
    sendWelcomeEmail(to: string, firstName: string, password: string): Promise<void>;
    sendWelcomeEmailNonDevice(to: string, firstName: string): Promise<void>;
    sendMailToRequestedCounsellar(to: string, firstName: string): Promise<void>;
    sendRejectionMailToRequestedCounsellar(to: string, firstName: string): Promise<void>;
    sendCredentialsMailToRequestedCounsellar(to: string, firstName: string, email: string, password: string): Promise<void>;
    sendOTP(to: string, otp: string): Promise<void>;
}
