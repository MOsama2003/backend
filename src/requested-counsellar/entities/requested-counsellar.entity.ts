import { IsNotEmpty, IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestedCounsellar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) 
  firstName: string;

  @Column({ nullable: true }) 
  lastName: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()  
  email: string;

  @Column()  
  @IsNotEmpty()
  resume: string;
}
