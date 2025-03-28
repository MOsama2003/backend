import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ConversationMessages } from "./conversationMessages.entity";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  conversationtId: number; 

  @ManyToMany(() => User)
  @JoinTable()
  conversationParticipants: User[]; 

  @OneToMany(() => ConversationMessages, (message) => message.conversation, { cascade: true })
  messages: ConversationMessages[];

  @CreateDateColumn()
  createdAt: Date;
}
