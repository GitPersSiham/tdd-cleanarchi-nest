import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../../domain/repositories/user.repository';
import { Username } from '../../domain/value-objects/username';
import { UserPassword } from '../../domain/value-objects/userpassword';
import { User } from '../../domain/models/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.validateUser(
      new Username(username),
      new UserPassword(password),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
