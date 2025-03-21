import { IsString, IsNotEmpty, IsOptional, IsDate, IsUUID, IsEnum } from 'class-validator';
import { TaskSeverity, TaskStatus } from 'src/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceTasks {
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    taskTitle: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    taskDescription: string;

    @Column({ type: 'enum', enum: TaskSeverity })
    @IsEnum(TaskSeverity)
    taskSeverity: TaskSeverity;

    @Column({ type: 'enum', enum: TaskStatus })
    @IsEnum(TaskStatus)
    taskStatus: TaskStatus;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    deviceId: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text' })
    deadliestDeadline: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text', nullable: true })
    notes: string;

    @IsDate()
    @IsNotEmpty()
    @Column({ type: 'text' })
    createdAt: Date;
}
