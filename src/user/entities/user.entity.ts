import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { DeviceLocDetails } from 'src/deviceLocDetails/entities/deviceLocDetails.entity';
import { SensorData } from 'src/sensorData/entities/sensorData.entity';
import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ unique: true })  // Ensure deviceId is unique
  @IsNotEmpty()
  deviceId: string;

  @Column({ nullable: true })  
  createdAt: string;

  @Column({ default: false })  
  disabled: boolean;

  @OneToOne(() => DeviceLocDetails, (deviceLoc) => deviceLoc.user, { cascade: true })
  deviceLocation: DeviceLocDetails;

  @OneToMany(() => SensorData, (sensorData) => sensorData.user)
  sensorData: SensorData[];
}
