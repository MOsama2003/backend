import { IsString, IsNotEmpty, IsOptional, IsDate, IsUUID, IsEnum } from 'class-validator';
import { TaskSeverity, TaskStatus } from 'src/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceTasks {
    @PrimaryGeneratedColumn()
    id : number;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text',nullable: true })
    taskTitle: string;

    @IsString()
    @IsNotEmpty()
    @Column({ type: 'text',nullable: true })
    taskDescription: string;

    @Column({ type: 'enum', enum: TaskSeverity , nullable: true})
    @IsEnum(TaskSeverity)
    taskSeverity: TaskSeverity;

    @Column({ type: 'enum', enum: TaskStatus, nullable: true })
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
