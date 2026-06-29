import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  findById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }
}
