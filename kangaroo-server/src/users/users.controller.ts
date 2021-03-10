import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "../auth/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { StickerPackRo } from "../sticker-packs/dto/sticker-pack-ro.dto";
import { UserPrivateRo } from "./dto/response-user-private.dto";
import { UserPublicRo } from "./dto/response-user-public.dto";
import { UserRo } from "./dto/response-user.dto";
import { UsersService } from "./user.service";

@ApiBearerAuth()
@ApiTags("user")
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: "Get all owned and joined sticker packs of logged in user.",
  })
  @Get("/me/sticker-packs")
  async getOwnAndJoinedStickerPacks(
    @User() user: UserRo
  ): Promise<StickerPackRo[]> {
    return this.usersService.getOwnedAndJoinedStickerPacks(user.id);
  }

  @ApiOperation({
    summary: "Get all owned sticker packs of logged in user.",
  })
  @Get("/me/sticker-packs/owned")
  async getOwnStickerPacks(@User() user: UserRo): Promise<StickerPackRo[]> {
    return this.usersService.getOwnedStickerPacks(user.id);
  }

  @ApiOperation({
    summary: "Get all joined sticker packs of logged in user.",
  })
  @Get("/me/sticker-packs/joined")
  async getJoinedStickerPacks(@User() user: UserRo): Promise<StickerPackRo[]> {
    return this.usersService.getJoinedStickerPacks(user.id);
  }

  @ApiOperation({
    summary: "Get private profile of currently logged in user.",
  })
  @Get("/me")
  async getOwnPrivateProfile(@User() user: UserRo): Promise<UserPrivateRo> {
    return this.usersService.getPrivateUser(user.id);
  }

  @ApiOperation({
    summary: "Get public profile of someone else.",
  })
  @Get("/users/:userId")
  async getPublicProfile(@Param("userId") userId: string): Promise<UserPublicRo> {
    return this.usersService.getPublicUser(userId);
  }
}
