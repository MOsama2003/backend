import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { DeviceLocDetails } from 'src/deviceLocDetails/entities/deviceLocDetails.entity';
import { SensorData } from 'src/sensorData/entities/sensorData.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => DeviceLocDetails, (deviceLoc) => deviceLoc.user)
  deviceLocations: DeviceLocDetails[];

  @OneToMany(() => SensorData, (sensorData) => sensorData.user)
  sensorData: SensorData[];
}
