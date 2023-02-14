import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ErrorHandler } from "src/error-handler/error-handler";
import { UserRepository } from "./user.repository";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@UseFilters(ErrorHandler)
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository
  ) {}

  @Post("/")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/")
  findAll() {
    return this.userRepository.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:oid")
  findOne(@Param("oid") oid: string) {
    return this.userRepository.findOne(oid);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:oid")
  update(@Param("oid") oid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(oid, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:oid")
  remove(@Param("oid") oid: string) {
    return this.userService.remove(oid);
  }
}
