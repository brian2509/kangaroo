import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { S3 } from "aws-sdk";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { PrivateFile } from "./entities/file.entity";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PrivateFile)
    private fileRepository: Repository<PrivateFile>
  ) {}

  async uploadFile(data: Buffer, appendToFileName: string): Promise<PrivateFile> {
    const s3 = new S3();
    const uuidName = uuid();

    let uploadResult;
    try {
      uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
          Body: data,
          Key: `${uuidName}-${appendToFileName}`,
        })
        .promise();
    } catch (e) {
      throw new NotFoundException("Could not upload file to S3.");
    }

    const file = this.fileRepository.create({
      id: uuidName,
      fileName: uploadResult.Key,
      bucketName: process.env.AWS_PRIVATE_BUCKET_NAME,
    });
    await this.fileRepository.save(file);

    return file;
  }

  async deleteFile(fileName: string) {
    const s3 = new S3();
    const fileInfo = await this.fileRepository.findOne({ fileName });
    if (!fileInfo) {
      throw new NotFoundException("File does not exist in database.");
    }

    try {
      await s3
        .deleteObject({
          Bucket: fileInfo.bucketName,
          Key: fileInfo.fileName,
        })
        .promise();
    } catch (e) {
      throw new NotFoundException("Could not delete file from S3.");
    }

    await this.fileRepository.delete(fileInfo.id);
    return fileInfo;
  }

  async getFile(fileName: string) {
    const s3 = new S3();
    const fileInfo = await this.fileRepository.findOne({
      where: { fileName },
    });
    if (!fileInfo) {
      throw new NotFoundException("File does not exist.");
    }

    const stream = s3
      .getObject({
        Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Key: fileInfo.fileName,
      })
      .createReadStream();

    return {
      stream,
      fileInfo,
    };
  }
}
