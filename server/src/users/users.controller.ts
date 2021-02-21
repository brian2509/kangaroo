import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "../auth/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { StickerPackRo } from "../sticker-packs/dto/sticker-pack-ro.dto";
import { UserRo } from "./dto/response-user.dto";
import { UsersService } from "./user.service";

@ApiTags("user")
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/me/sticker-packs")
  async getOwnStickerPacks(@User() user: UserRo): Promise<StickerPackRo[]> {
    return this.usersService.getOwnStickerPacks(user.id);
  }
}
