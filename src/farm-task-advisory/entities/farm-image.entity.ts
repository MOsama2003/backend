
// entities/farm-image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Farm } from './farm.entity';

@Entity('farm_images')
export class FarmImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  publicId: string;
  
  @Column('date')
  uploadDate: Date;

  @ManyToOne(() => Farm, farm => farm.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @Column()
  farmId: string;

  @CreateDateColumn()
  createdAt: Date;
}
