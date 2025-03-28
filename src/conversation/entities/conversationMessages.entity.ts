import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity";

@Entity()
export class ConversationMessages {
  @PrimaryGeneratedColumn()
  messageId: number; 

  @ManyToOne(() => Conversation, (chat) => chat.messages)
  conversation: Conversation; 

  @Column({ nullable: true })
  text: string; 
  
  @Column({ nullable: true })
  fileUrl: string; 

  @ManyToOne(() => User)
  sender: User; 

  @Column({ default: false })
  isRead: boolean; 

  @CreateDateColumn()
  createdAt: Date; 
}
