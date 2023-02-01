import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MulterFile } from "../files/file.validation";
import { FilesService } from "../files/files.service";
import { UsersService } from "../users/user.service";
import { CreateStickerDto } from "./dto/create-sticker.dto";
import { StickerRo } from "./dto/response-sticker.dto";
import { Sticker } from "./entities/sticker.entity";
import { ImagesService } from "./images.service";
import { PrivateFile } from "../files/entities/file.entity";
import { streamToBuffer } from "../util/streams";
import { Buffer } from "buffer";

@Injectable()
export class StickersService {
  constructor(
    @InjectRepository(Sticker) private stickerRepository: Repository<Sticker>,
    private usersService: UsersService,
    private imagesService: ImagesService,
    private filesService: FilesService
  ) {}

  async create(
    stickerPackId: string,
    createStickerDto: CreateStickerDto,
    file: MulterFile,
    animated: boolean,
    userId: string
  ): Promise<StickerRo> {
    const whatsAppStickerImage = await this.imagesService.createWhatsappImage(
      file.buffer,
      animated
    );

    const whatsAppStickerImageFile = await this.filesService.uploadFile(
      whatsAppStickerImage,
      "whatsapp-sticker.webp"
    );

    const sticker = this.stickerRepository.create({
      author: { id: userId },
      name: createStickerDto.name,
      whatsAppStickerImageFile,
      stickerPack: { id: stickerPackId },
    });

    const savedSticker = await this.stickerRepository.save(sticker);
    return (
      await this.stickerRepository.findOne({
        where: { id: savedSticker.id },
      })
    ).toRO();
  }

  async createBase64(
    stickerPackId: string,
    createStickerDto: CreateStickerDto,
    buffer: Buffer,
    animated: boolean,
    userId: string
  ): Promise<StickerRo> {
    const whatsAppStickerImage = await this.imagesService.createWhatsappImage(
      buffer,
      animated
    );

    const whatsAppStickerImageFile = await this.filesService.uploadFile(
      whatsAppStickerImage,
      "whatsapp-sticker.webp"
    );

    const sticker = this.stickerRepository.create({
      author: { id: userId },
      name: createStickerDto.name,
      whatsAppStickerImageFile,
      stickerPack: { id: stickerPackId },
    });

    const savedSticker = await this.stickerRepository.save(sticker);
    return (
      await this.stickerRepository.findOne({
        where: { id: savedSticker.id },
      })
    ).toRO();
  }

  async get(id: string): Promise<Sticker> {
    const sticker = await this.stickerRepository.findOne({
      where: { id },
    });

    if (!sticker) {
      throw new NotFoundException();
    }

    return sticker;
  }

  async remove(id: string): Promise<StickerRo> {
    const sticker = await this.stickerRepository.findOne({
      where: { id },
    });

    if (!sticker) {
      throw new NotFoundException();
    }

    // TODO: Reverse these actions/use transactions.
    await this.stickerRepository.delete(id);
    await this.filesService.deleteFile(
      sticker.whatsAppStickerImageFile.fileName
    );

    return sticker.toRO();
  }

  async transformAndUploadTrayIcon(
    file: MulterFile | Buffer
  ): Promise<PrivateFile> {
    const buffer = file instanceof Buffer ? file : file.buffer;
    const whatsAppIconImage = await this.imagesService.createWhatsappIcon(
      buffer
    );

    return await this.filesService.uploadFile(
      whatsAppIconImage,
      "whatsapp-icon.png"
    );
  }

  async stickerFileToBuffer(stickerFile: PrivateFile): Promise<Buffer> {
    const file = await this.filesService.getFile(stickerFile.fileName);
    return await streamToBuffer(file.stream);
  }

  async deleteTrayIcon(file: PrivateFile): Promise<void> {
    await this.filesService.deleteFile(file.fileName);
  }
}
