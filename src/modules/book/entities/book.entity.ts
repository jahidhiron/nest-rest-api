import { BaseEntity } from '@/common/entities';
import { AuthorEntity } from '@/modules/author/entities/author.entity';
import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
  RelationId,
} from 'typeorm';

@Entity('books')
@Unique(['isbn'])
export class BookEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  isbn: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ nullable: true })
  genre?: string;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

  @RelationId((book: BookEntity) => book.author)
  authorId: number;
}
