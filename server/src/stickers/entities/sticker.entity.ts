import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PublicFile } from "../../files/entities/file.entity";
import { User } from "../../users/entities/user.entity";

@Entity("sticker")
export class Sticker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.stickers)
  author: User;

  @ManyToOne(() => PublicFile, (file) => file.stickers, { eager: true })
  file: PublicFile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
