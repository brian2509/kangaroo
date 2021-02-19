import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async mockUser(): Promise<User> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      const user = this.userRepository.create({
        email: "mock@email.com",
      });
      await this.userRepository.save(user);
    }
    return (await this.userRepository.find())[0];
  }
}
