import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column()
  Nitrogen: string;

  @Column()
  Potassium: string;

  @Column()
  Phosphorous: string;

  @Column()
  Conductivity: string;

  @Column()
  pH: string;

  @Column()
  Humidity: string;

  @Column()
  Temperature: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sensorData, { onDelete: 'CASCADE' })
  user: User;
}
