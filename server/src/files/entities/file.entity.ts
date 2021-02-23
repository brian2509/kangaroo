import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Sticker } from "../../stickers/entities/sticker.entity";

@Entity("file")
export class PrivateFile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bucketName: string;

  @Column()
  fileName: string;

  @OneToMany(() => Sticker, (sticker) => sticker.file)
  stickers?: Sticker[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  fileUrl(): string {
    // TODO: Make this more robust.
    return `${process.env.DOMAIN_NAME}/api/files/${this.fileName}`;
  }
}
