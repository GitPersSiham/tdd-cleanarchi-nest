// use a model

import { UserDto } from '../domain/dto/user-dto';
import { User, UserCredentials } from '../domain/models/user';

describe('Authentication', () => {
  describe('Domain', () => {
    describe('User', () => {
      const makeUser = (name = 'Test&', password = 'TestPassword200*') => () =>
        User.create({
          username: name,
          password: password,
          firstname: 'Siham',
          lastname: 'Lahouali',
        } as UserDto);
      it('it should instantiate a User entity', () => {
        const user = makeUser()();
        expect(user).toBeTruthy();
      });
      it('should throw an error if the username is invalid', () => {
        expect(makeUser('test')).toThrow(
          'Invalid user name length, it must be at leat 5 characters',
        );
      });
      it('should throw an error if the password is invalid', () => {
        expect(makeUser(undefined, 'notstrongpass')).toThrow(
          'Invalid user password, the password must contains uppercase characters, lowercase characters, numeric characters and special characters, and a length of 8 characters.',
        );
      });
      it('should extend a user with new data', () => {
        const user = makeUser()();
        const newUser = user.extend({
          firstname: 'Jhonny',
          lastname: 'Cash',
        } as User);
        expect(newUser.firstname).toBe('Jhonny');
        expect(newUser.lastname).toBe('Cash');
        expect(newUser.password.value).toBe(user.password.value);
        expect(newUser.username.value).toBe(user.username.value);
      });

      it('should return a full name if is required', () => {
        const user = makeUser()();
        expect(user.firstname).toEqual('Siham');
        expect(user.lastname).toEqual('Lahouali');
        expect(user.getFullName()).toEqual('Siham Lahouali');
      });

      it('should return data without password', () => {
        const user = makeUser()();
        expect(user.infoWithoutPassword().password).toBeFalsy();
      });
      it('should return data as DTO', async () => {
        const user = makeUser('test&', 'MyPassWord2&')();
        const userDTO = await (await user).dataAsDto();
        expect(await userDTO.username).toBe('test&');
        expect(await userDTO.password).toBe('MyPassWord2&');
        expect(await userDTO.firstname).toBe('Siham');
        expect(await userDTO.lastname).toBe('Lahouali');
      });
    });
  });
  describe('UserCredentials', () => {
    it('should create user credentials', async () => {
      const makeUserCredentials = () =>
        UserCredentials.create({
          username: 'jdoe1',
          password: 'ThisIsAStrongPassword123*',
        } as UserDto);
      const userCredentials = makeUserCredentials();
      expect(await userCredentials).toBeTruthy();
    });
  });
});
