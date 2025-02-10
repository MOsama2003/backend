import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class DeviceLocDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relation with User
  @ManyToOne(() => User, (user) => user.deviceLocations, { onDelete: 'CASCADE' })
  user: User;
}
