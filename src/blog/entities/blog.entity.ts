import { ArrayMaxSize, IsArray, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 1800)
  articleContent: string;

  @Column({ nullable : true })
  @IsString()
  articleImage: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  articleTitle: string;

  @Column("text", { array: true }) 
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(5) 
  @IsString({ each: true })
  articleKeyword: string[];

  @Column()
  articlePublishDate: string;

  @ManyToOne(() => User, (user) => user.blog, { onDelete: "CASCADE" })
  user: User;
}
