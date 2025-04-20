import { DeliveryStatus } from "src/constants";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  file: string; 

  @ManyToOne(() => User)
  sender: User; 

  @Column({ type: "enum", enum: DeliveryStatus , default: DeliveryStatus.SEND })
  status: DeliveryStatus; 

  @Column()
  createdAt: Date; 

  @Column({ nullable: true })
  broadcastId: string; 
}
