import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { S3 } from "aws-sdk";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { PublicFile } from "./entities/file.entity";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile) private fileRepository: Repository<PublicFile>
  ) {}

  async uploadFile(data: Buffer, fileName: string): Promise<PublicFile> {
    // Upload file.
    const s3 = new S3();
    const uuidName = uuid();

    // TODO: check if this failed or not.
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: data,
        Key: `${uuidName}-${fileName}`,
      })
      .promise();

    // Add to database.
    const publicFile = this.fileRepository.create({
      id: uuidName,
      fileName: fileName,
      url: uploadResult.Location,
      bucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
    });
    await this.fileRepository.save(publicFile);

    return publicFile;
  }
}
