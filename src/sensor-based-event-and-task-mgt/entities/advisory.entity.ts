import { IsString, IsNotEmpty, IsOptional, IsDate, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceAdvisory {
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    precaution: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    risk_factors: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    recommended_action: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    deviceId: string;

    @IsDate()
    @IsNotEmpty()
    @Column({ type: 'text' })
    createdAt: Date;
}
