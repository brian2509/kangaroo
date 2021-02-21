import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StickerPackRo } from "../sticker-packs/dto/sticker-pack-ro.dto";
import { UsersService } from "./user.service";

@ApiTags("user")
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/me/sticker-packs")
  async getOwnStickerPacks(): Promise<StickerPackRo[]> {
    const user = await this.usersService.mockUser();
    return this.usersService.getOwnStickerPacks(user.id);
  }
}
