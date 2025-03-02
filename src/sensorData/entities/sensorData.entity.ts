import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column({ type: 'float' })
  nitrogen: number;

  @Column({ type: 'float' })
  potassium: number;

  @Column({ type: 'float' })
  phosphorus: number;

  @Column({ type: 'float' })
  conductivity: number;

  @Column({ type: 'float' })
  pH: number;

  @Column({ type: 'float' })
  humidity: number;

  @Column({ type: 'float' })
  temperature: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
