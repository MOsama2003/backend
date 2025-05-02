// entities/farm-task.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Farm } from './farm.entity';

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

@Entity('farm_tasks')
export class FarmTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column()
  title: string;

  @Column()
  priority: string;

  @Column('date')
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus;

  @Column('text')
  context: string;

  @Column('text')
  taskDescription: string;

  @Column('json')
  steps: string[];

  @Column('text')
  supportingInformation: string;

  @Column('text')
  followUp: string;

  @Column('json')
  dependencies: string[];

  @ManyToOne(() => Farm, farm => farm.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @Column()
  farmId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}