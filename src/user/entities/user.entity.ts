import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
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

  @Column({ nullable: true }) 
  avatar: string;

  @Column({ nullable: true }) 
  refreshToken: string;

  @Column()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Column({ nullable: true })  
  role: string;

  @Column()
  @IsNotEmpty()
  deviceId: string;

  @Column({ nullable: true })  
  createdAt: string;

  @Column({ default: false })  
  disabled: boolean;
}
