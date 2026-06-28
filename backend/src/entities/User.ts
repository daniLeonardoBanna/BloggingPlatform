import { Entity, Column, Index, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { Post } from './Post';
import { Comment } from './Comment';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends AbstractEntity {
  // @Index()
  @Column({ name: 'firstName', length: 100 })
  firstName!: string;

  @Column({ name: 'lastName', length: 100 })
  lastName!: string;

  @Index({ unique: true })
  @Column({ name: 'email', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password', length: 255 })
  password!: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ name: 'isActive', default: true })
  isActive!: boolean;

  @Column({ name: 'refreshToken', length: 255, nullable: true })
  refreshToken!: string | null;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}
