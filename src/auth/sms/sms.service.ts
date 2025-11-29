import { Injectable, BadRequestException } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendVerificationCode(phone: string, code: string) {
    try {
      const message = await this.client.messages.create({
        body: `Tu código de verificación es: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      return { sid: message.sid, status: message.status };
    } catch (error) {
      throw new BadRequestException(`Error enviando SMS: ${error.message}`);
    }
  }
}
