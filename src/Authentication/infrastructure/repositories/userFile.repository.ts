import { join } from 'path';
import { homedir } from 'os';
import { readFileSync, writeFileSync } from 'fs';

import { User } from 'src/Authentication/domain/models/user';
import { Username } from 'src/Authentication/domain/value-objects/username';
import { UserPassword } from 'src/Authentication/domain/value-objects/userpassword';

import { DomainError } from 'src/Authentication/domain/domain-error';
import { IUsersRepository } from '../../domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

export class FileUsersRepository implements IUsersRepository {
  private data: User[];
  private filepath: string;

  constructor() {
    this.filepath = join(homedir(), '.hex_storage.json');
    try {
      this.data = JSON.parse(readFileSync(this.filepath).toString()).map(
        User.create,
      );
      console.log(this.data);
    } catch (error) {
      this.data = [];
      this.saveFile();
    }
  }

  async updatePassword(user: User, newPassword: UserPassword): Promise<void> {
    const storedUser = this.getUserById(user.id);
    if (storedUser && storedUser.password.value === user.password.value) {
      this.save(await storedUser.extend({ password: newPassword } as User));
      this.saveFile();
    } else {
      throw new DomainError('Invalid user information');
    }
  }

  private saveFile(): void {
    writeFileSync(
      this.filepath,
      JSON.stringify(
        this.data.map((user: User) => user.dataAsDto()),
        null,
        2,
      ),
    );
  }

  validateUser(username: Username, password: UserPassword): User | null {
    const resp = this.data.filter(user => {
      return (
        user.username.value === username.value &&
        user.password.value === password.value
      );
    });
    return resp.length === 1 ? resp.pop() : null;
  }

  getUsersList(): User[] {
    return this.data.map(user => user.infoWithoutPassword());
  }

  delete(id: string) {
    const nb = this.data.length;
    this.data = [...this.data.filter(u => u.id !== id)];
    if (this.data.length < nb) {
      return this.data.find(u => u.id);
    } else {
      return 'user est deja suprimé';
    }
  }

  getUserByUsername(username: Username) {
    const res = this.data
      .filter(user => user.username.value === username.value)
      .pop();
  }

  getUserById(id: string): User {
    return this.data.filter(user => user.id === id).pop();
  }

  save(user: User): void {
    const oldUser = this.data.filter(u => u.id === user.id).pop();
    if (oldUser) {
      const idx = this.data.indexOf(oldUser);
      this.data.splice(idx, 1, user);
    } else {
      this.data.push(user);
    }
    this.saveFile();
  }
}
