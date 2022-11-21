import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Inject,
  UseGuards,
  Req,
  UseFilters,
  Put,
} from '@nestjs/common';
import { User, UserCredentials } from '../domain/models/user';
import { UserDto, ChangeUserPasswordDto } from '../domain/dto/user-dto';
import { UsersService } from '../application/users.service';
import { AuthGuard } from '@nestjs/passport';
import { DomainExceptionFilter } from './error.filter';
import { UserPassword } from '../domain/value-objects/userpassword';

@Controller('/api/v1/auth')
@UseFilters(new DomainExceptionFilter())
export class AuthenticationController {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  getApiStatus(): any {
    return {
      status: 'OK',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('user')
  async changePass(
    @Body(new ValidationPipe({ transform: true }))
    userData: ChangeUserPasswordDto,
  ): Promise<any> {
    const user = UserCredentials.create({
      id: userData.id,
      password: userData.password,
    } as UserDto);
    const res = await this.usersService.changeUserPassword(
      await user,
      new UserPassword(userData.newPassword),
    );
    return res;
  }

  @Post('register')
  async registerNewUser(
    @Body(new ValidationPipe({ transform: true })) user: UserDto,
  ): Promise<any> {
    const newUser = await User.create(user);
    this.usersService.createUser(newUser);
    return newUser.infoWithoutPassword();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req): Promise<any> {
    return this.usersService.login(req.user);
  }

  @Get('users')
  async getlistUsers(): Promise<User[]> {
    const users = this.usersService.getUsers();
    return users;
  }
}
