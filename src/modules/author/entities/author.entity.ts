import { BaseEntity } from '@/common/entities';
import { BookEntity } from '@/modules/book/entities';
import { UserEntity } from '@/modules/user/entities';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('authors')
export class AuthorEntity extends BaseEntity {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'text', nullable: true, name: 'bio' })
  bio?: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate?: Date;

  @OneToMany(() => BookEntity, (book) => book.author, { cascade: true })
  books: BookEntity[];

  @ManyToOne(() => UserEntity, (user) => user.authors, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: number;
}
