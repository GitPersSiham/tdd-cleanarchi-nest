import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUsersRepository } from '../domain/repositories/user.repository';
import { User, UserCredentials } from '../domain/models/user';
import { DomainError } from '../domain/domain-error';
import { UserPassword } from '../domain/value-objects/userpassword';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: User): Promise<void> {
    if (this.usersRepository.getUserById(user.id)) {
      throw new DomainError(`The user with id ${user.id} already exists.`);
    }
    this.usersRepository.save(user);
  }

  async changeUserPassword(
    user: UserCredentials,
    newPassword: UserPassword,
  ): Promise<boolean> {
    this.usersRepository.updatePassword(user, newPassword);
    return true;
  }

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.getUsersList();
  }

  async login(user: User) {
    const payload = await user.infoWithoutPassword();
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
