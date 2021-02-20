import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PrivateFile } from "../../files/entities/file.entity";
import { User } from "../../users/entities/user.entity";

@Entity("sticker")
export class Sticker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.stickers)
  author: User;

  @ManyToOne(() => PrivateFile, (file) => file.stickers, { eager: true })
  file: PrivateFile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
