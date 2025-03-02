import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceLocDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  deviceId: string;

  @Column()  
  longitude: number;

  @Column()  
  latitude: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
