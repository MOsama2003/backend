import { IsNotEmpty, IsEmail } from 'class-validator';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'simple-array', nullable: true, default: '1,2,3,4,5'  })  
  workingDays: number[];  

  @Column({ nullable: true, default: '09:00' })  
  startTime: string; //09:00

  @Column({ nullable: true, default: '17:00' })  
  endTime: string;  //"14:00"

  @OneToMany(() => Appointment, (appointment) => appointment.counselor)
  appointments: Appointment[];
}
