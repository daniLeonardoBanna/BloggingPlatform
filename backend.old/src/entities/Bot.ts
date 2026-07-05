import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { Post } from './Post';
import { Comment } from './Comment';

@Entity('bots')
export class Bot extends AbstractEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  persona!: string;

  @Column({ length: 255 })
  instructions!: string;

  @OneToMany(() => Post, (post) => post.bot)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.bot)
  comments!: Comment[];
}
