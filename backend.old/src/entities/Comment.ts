import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { Post } from './Post';
import { User } from './User';
import { Bot } from './Bot';

@Entity('comments')
export class Comment extends AbstractEntity {
  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Bot, (bot) => bot.comments)
  @JoinColumn({ name: 'botId' })
  bot!: Bot;
}
