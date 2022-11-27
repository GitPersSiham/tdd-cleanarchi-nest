import { User, UserCredentials } from '../models/user';
import { Username } from '../value-objects/username';
import { UserPassword } from '../value-objects/userpassword';

export interface IUsersRepository {
  getUserById(id: string): User;
  getUserByUsername(username: Username);
  getUsersList(): User[];
  delete(id: string);
  save(user: User): void;
  validateUser(username: Username, password: UserPassword): User | null;
  updatePassword(user: UserCredentials, newPassword: UserPassword): void;
}
