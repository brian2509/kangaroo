import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("file")
export class PrivateFile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bucketName: string;

  @Column()
  fileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  fileUrl(): string {
    return `${process.env.DOMAIN_NAME}/api/files/${this.fileName}`;
  }
}
