import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class DeviceLocDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Ensures one-to-one mapping with a unique deviceId
  deviceId: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.deviceLocation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deviceId', referencedColumnName: 'deviceId' }) // Link using deviceId
  user: User;
}
