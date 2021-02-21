import { Controller, Get } from "@nestjs/common";
import { StickerPackRo } from "../sticker-packs/dto/sticker-pack-ro.dto";
import { UsersService } from "./user.service";

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/me/sticker-packs")
  async getOwnStickerPacks(): Promise<StickerPackRo[]> {
    const user = await this.usersService.mockUser();
    return this.usersService.getOwnStickerPacks(user.id);
  }
}
