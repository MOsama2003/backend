import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reaction } from "./reaction.entity";

@Entity()
export class Feed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { array: true, nullable: true })
    media: string[];
    
    @Column()
    @IsString()
    @IsNotEmpty()
    caption: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    publishedDate: string;

    @ManyToOne(()=> User, (user)=>user.feed, { onDelete: "CASCADE" })
    publisher: User;

    @OneToMany(()=> Reaction, (user)=>user.feed, { cascade: true })
    reaction: Reaction;
}
