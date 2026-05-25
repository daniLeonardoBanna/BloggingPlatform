import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { User } from './User';
import { Comment } from './Comment';
import { Bot } from './Bot';

@Entity('posts')
export class Post extends AbstractEntity {
  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Bot, (bot) => bot.posts)
  @JoinColumn({ name: 'botId' })
  bot!: Bot;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
