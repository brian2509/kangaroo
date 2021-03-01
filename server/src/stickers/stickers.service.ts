import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as sharp from "sharp";
import { Repository } from "typeorm";
import { MulterFile } from "../files/file.validation";
import { FilesService } from "../files/files.service";
import { UsersService } from "../users/user.service";
import { CreateStickerDto } from "./dto/create-sticker.dto";
import { StickerRo } from "./dto/response-sticker.dto";
import { Sticker } from "./entities/sticker.entity";

@Injectable()
export class StickersService {
  constructor(
    @InjectRepository(Sticker) private stickerRepository: Repository<Sticker>,
    private usersService: UsersService,
    private filesService: FilesService
  ) {}

  async create(
    stickerPackId: string,
    createStickerDto: CreateStickerDto,
    file: MulterFile,
    userId: string
  ): Promise<StickerRo> {
    let whatsAppStickerImage;
    let whatsAppIconImage;
    try {
      whatsAppStickerImage = await sharp(file.buffer)
        .resize(512, 512)
        .webp()
        .toBuffer();

      whatsAppIconImage = await sharp(file.buffer)
        .resize(96, 96)
        .webp()
        .toBuffer();
    } catch (e) {
      throw new ForbiddenException("Could not resize/convert images.");
    }

    if (whatsAppStickerImage.byteLength / 1024 > 100) {
      throw new ForbiddenException("The (sticker) file is too large.");
    }

    if (whatsAppIconImage.byteLength / 1024 > 50) {
      throw new ForbiddenException(
        "The (sticker thumbnail) file is too large."
      );
    }

    const whatsAppStickerImageFile = await this.filesService.uploadFile(
      whatsAppStickerImage,
      "whatsapp-sticker.webp"
    );

    const whatsAppIconImageFile = await this.filesService.uploadFile(
      whatsAppIconImage,
      "whatsapp-icon.webp"
    );

    const sticker = this.stickerRepository.create({
      author: { id: userId },
      name: createStickerDto.name,
      whatsAppStickerImageFile,
      whatsAppIconImageFile,
      stickerPack: { id: stickerPackId },
    });

    const savedSticker = await this.stickerRepository.save(sticker);
    return (
      await this.stickerRepository.findOne({
        where: { id: savedSticker.id },
      })
    ).toRO();
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
    await this.filesService.deleteFile(sticker.whatsAppIconImageFile.fileName);

    return sticker.toRO();
  }
}
