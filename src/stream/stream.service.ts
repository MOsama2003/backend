import { Injectable } from "@nestjs/common";
import { StreamChat } from "stream-chat";


@Injectable()
export class StreamService {
  private serverClient: StreamChat;
  constructor() {
    this.serverClient = StreamChat.getInstance("dmv879kfq7fh", "p946xb2svrd4jjsth7xammsupm8bphyhttq4zg42vrqgeuuhy2ur6hdwg26j2ucj");
  }

  generateStreamToken(userId: number) {
    try {
      return this.serverClient.createToken(userId.toString());
    } catch (error) {
      throw new Error(`Failed to generate Stream token: ${error.message}`);
    }
  }

  async createStreamUser(user: { id: number; name: string; email: string }) {
    console.log(user,'sssssssssssssss')
    try {
      const streamUser = await this.serverClient.upsertUser({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      });

      return streamUser;
    } catch (error) {
      throw new Error(`Failed to create Stream user: ${error.message}`);
    }
  }
}
