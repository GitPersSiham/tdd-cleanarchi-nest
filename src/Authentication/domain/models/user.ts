import { v4 as uuid } from 'uuid';
import { UserDto } from '../dto/user-dto';
import { Username } from '../value-objects/username';
import { UserPassword } from '../value-objects/userpassword';

export class User {
  readonly id: string;
  readonly username: Username;
  readonly password: UserPassword;
  readonly firstname: string;
  readonly lastname: string;
  constructor(
    id: string,
    username: Username,
    password: UserPassword,
    firstname: string,
    lastname: string,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  static create(user: UserDto) {
    return new User(
      user.id || uuid(),
      new Username(user.username),
      new UserPassword(user.password),
      user.firstname,
      user.lastname,
    );
  }
  getFullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
  infoWithoutPassword(): any {
    return {
      id: this.id,
      username: this.username.value,
      firstname: this.firstname,
      lastname: this.lastname,
    };
  }
  extend(user: User) {
    return new User(
      user.id,
      user.username,
      user.password,
      user.firstname,
      user.lastname,
    );
  }
  dataAsDto(): UserDto {
    return {
      id: this.id,
      username: this.username.value,
      password: this.password.value,
      firstname: this.firstname,
      lastname: this.lastname,
    };
  }
}

export class UserCredentials {
  readonly id: string;
  readonly password: UserPassword;

  constructor(id: string, password: UserPassword) {
    this.id = id;
    this.password = password;
  }

  static async create(user: UserDto): Promise<UserCredentials> {
    return new UserCredentials(user.id, new UserPassword(user.password));
  }
}
