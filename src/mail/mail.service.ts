import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

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

  async sendWelcomeEmail(to: string, firstName: string) {
    const mailOptions = {
      from: 'mo354598@gmail.com',
      to,
      subject:
        '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <img src="https://img.freepik.com/premium-vector/agriculture-logo-icon-design-illustration_586739-93.jpg" alt="AgriSense Logo" style="width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #228B22; text-align: center;">🌾 Welcome to AgriSense, ${firstName}! 🚜</h2>
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
    } catch (error) {
      console.error(`❌ Error sending email:`, error);
    }
  }

  async sendMailToRequestedCounsellar(to: string, firstName: string) {
    const mailOptions = {
      from: 'mo354598@gmail.com',
      to,
      subject:
        '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          ${firstName} your request for becoming a part of AgriSense as Counsellar is submitted, you will be informed once decision will be taken regarding you
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`❌ Error sending email:`, error);
    }
  }

  async sendRejectionMailToRequestedCounsellar(to: string, firstName: string) {
    const mailOptions = {
      from: 'mo354598@gmail.com',
      to,
      subject:
        '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          unfortunately ${firstName}, your request to become Counsellar is not accepted!
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`❌ Error sending email:`, error);
    }
  }

  async sendCredentialsMailToRequestedCounsellar(
    to: string,
    firstName: string,
    email: string,
    password: string,
  ) {
    const mailOptions = {
      from: 'mo354598@gmail.com',
      to,
      subject:
        '🌿 Welcome to AgriSense – Empowering Farmers with Smart Technology!',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; color: #333;">
         Congratulations ${firstName}! 
         your request to become Counsellar is accepted your credentials are email: ${email} and password: ${password}
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`❌ Error sending email:`, error);
    }
  }
}
