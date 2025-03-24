import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; 

  @Column()
  appointmentDate: Date;

  @ManyToOne(() => RequestedCounsellar, (counselor) => counselor.appointments)
  counselor: RequestedCounsellar;
}
