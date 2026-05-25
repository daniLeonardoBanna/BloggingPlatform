import { AppDataSource } from '@config/database';
import { User } from '@entities/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({ where: { isActive: true } });
  }
}

// Singleton instance
export const userRepository = new UserRepository();
