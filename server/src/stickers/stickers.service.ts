import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FilesService } from "../files/files.service";
import { UsersService } from "../users/user.service";
import { CreateStickerDto } from "./dto/create-sticker.dto";
import { StickerRo } from "./dto/response-sticker.dto";
import { UpdateStickerDto } from "./dto/update-sticker.dto";
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
    file: any,
    userId: string
  ): Promise<StickerRo> {
    const uploadedFile = await this.filesService.uploadFile(
      file.buffer,
      file.originalname
    );
    // TODO: Add image/file validation.
    const sticker = this.stickerRepository.create({
      author: { id: userId },
      name: createStickerDto.name,
      file: uploadedFile,
      stickerPack: { id: stickerPackId },
    });

    const savedSticker = await this.stickerRepository.save(sticker);
    return {
      id: savedSticker.id,
      name: savedSticker.name,
      url: savedSticker.file.fileUrl(),
    };
  }

  async findAll(): Promise<StickerRo[]> {
    const stickers = await this.stickerRepository.find();
    return stickers.map((sticker) => {
      return {
        id: sticker.id,
        name: sticker.name,
        url: sticker.file.fileUrl(),
      };
    });
  }

  async findOne(id: string): Promise<StickerRo> {
    const sticker = await this.stickerRepository.findOne({
      where: { id },
    });
    if (!sticker) {
      throw new NotFoundException();
    }
    return {
      id: sticker.id,
      name: sticker.name,
      url: sticker.file.fileUrl(),
    };
  }

  async update(
    id: string,
    updateStickerDto: UpdateStickerDto
  ): Promise<StickerRo> {
    const sticker = await this.findOne(id);
    const updatedSticker = { ...sticker, ...updateStickerDto };
    const saved = await this.stickerRepository.save(updatedSticker);
    return {
      id: saved.id,
      name: saved.name,
      url: saved.url,
    };
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
    await this.filesService.deleteFile(sticker.file.fileName);

    return {
      id: sticker.id,
      name: sticker.name,
      url: sticker.file.fileUrl(),
    };
  }
}
