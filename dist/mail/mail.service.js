"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mo354598@gmail.com',
                pass: 'bead cmts rczm hnvf',
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendWelcomeEmail(to, firstName, password) {
        const mailOptions = {
            from: 'mo354598@gmail.com',
            to,
            subject: '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <img src="https://img.freepik.com/premium-vector/agriculture-logo-icon-design-illustration_586739-93.jpg" alt="AgriSense Logo" style="width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #228B22; text-align: center;">🌾 Welcome to AgriSense, ${firstName}! here is your password ${password} 🚜</h2>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              We're thrilled to have you as part of our smart farming community! AgriSense is here to help you
              make data-driven decisions for your crops, soil, and farm management.
            </p>
            
            <h3 style="color: #2E8B57; text-align: center;">What You Can Do with AgriSense:</h3>
            <ul style="list-style: none; padding: 0; text-align: center;">
              <li>✅ Monitor soil health in real-time 📊</li>
              <li>✅ Get AI-powered crop recommendations 🌱</li>
              <li>✅ Optimize water and fertilizer usage 💧</li>
              <li>✅ Boost your farm's productivity! 🚀</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://your-app-url.com" 
                 style="background-color: #228B22; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 18px; border-radius: 5px;">
                🚀 Get Started Now
              </a>
            </p>

            <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">

            <p style="font-size: 14px; text-align: center; color: #666;">
              If you have any questions, feel free to reply to this email or visit our 
              <a href="https://your-support-url.com" style="color: #228B22; text-decoration: none;">Support Center</a>.
            </p>
            
            <p style="text-align: center; font-size: 12px; color: #999;">
              🌿 AgriSense – Smart Solutions for Sustainable Farming 🌿 <br>
              © 2024 AgriSense Inc. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`❌ Error sending email:`, error);
        }
    }
    async sendWelcomeEmailNonDevice(to, firstName) {
        const mailOptions = {
            from: 'mo354598@gmail.com',
            to,
            subject: '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <img src="https://img.freepik.com/premium-vector/agriculture-logo-icon-design-illustration_586739-93.jpg" alt="AgriSense Logo" style="width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #228B22; text-align: center;">🌾 Welcome to AgriSense, ${firstName}! here is your password 🚜</h2>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              We're thrilled to have you as part of our smart farming community! AgriSense is here to help you
              make data-driven decisions for your crops, soil, and farm management.
            </p>
            
            <h3 style="color: #2E8B57; text-align: center;">What You Can Do with AgriSense:</h3>
            <ul style="list-style: none; padding: 0; text-align: center;">
              <li>✅ Monitor soil health in real-time 📊</li>
              <li>✅ Get AI-powered crop recommendations 🌱</li>
              <li>✅ Optimize water and fertilizer usage 💧</li>
              <li>✅ Boost your farm's productivity! 🚀</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://your-app-url.com" 
                 style="background-color: #228B22; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 18px; border-radius: 5px;">
                🚀 Get Started Now
              </a>
            </p>

            <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">

            <p style="font-size: 14px; text-align: center; color: #666;">
              If you have any questions, feel free to reply to this email or visit our 
              <a href="https://your-support-url.com" style="color: #228B22; text-decoration: none;">Support Center</a>.
            </p>
            
            <p style="text-align: center; font-size: 12px; color: #999;">
              🌿 AgriSense – Smart Solutions for Sustainable Farming 🌿 <br>
              © 2024 AgriSense Inc. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`❌ Error sending email:`, error);
        }
    }
    async sendMailToRequestedCounsellar(to, firstName) {
        const mailOptions = {
            from: 'mo354598@gmail.com',
            to,
            subject: '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          ${firstName} your request for becoming a part of AgriSense as Counsellar is submitted, you will be informed once decision will be taken regarding you
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`❌ Error sending email:`, error);
        }
    }
    async sendRejectionMailToRequestedCounsellar(to, firstName) {
        const mailOptions = {
            from: 'mo354598@gmail.com',
            to,
            subject: '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          unfortunately ${firstName}, your request to become Counsellar is not accepted!
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`❌ Error sending email:`, error);
        }
    }
    async sendCredentialsMailToRequestedCounsellar(to, firstName, email, password) {
        const mailOptions = {
            from: 'mo354598@gmail.com',
            to,
            subject: '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
         Congratulations ${firstName}! 
         your request to become Counsellar is accepted your credentials are email: ${email} and password: ${password}
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`❌ Error sending email:`, error);
        }
    }
    async sendOTP(to, otp) {
        const mailOptions = {
            from: 'mo354598@gmail.com',
            to,
            subject: '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
        your otp is ${otp} 
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(`❌ Error sending email:`, error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map