import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(":fileName")
  async getFile(@Param("fileName") fileName: string, @Res() res: Response) {
    const file = await this.filesService.getFile(fileName);
    file.stream.pipe(res);
  }
}
