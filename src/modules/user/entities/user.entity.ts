import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities';
import { LoginHistory, VerificationTokenEntity } from '@/modules/auth/entities';
import { AuthorEntity } from '@/modules/author/entities';
import { EntityName } from '@/shared/enums';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  role: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => VerificationTokenEntity, (token) => token.user)
  verificationTokens: VerificationTokenEntity[];

  @OneToMany(() => LoginHistory, (history) => history.user)
  loginHistories: LoginHistory[];

  @OneToMany(() => AuthorEntity, (author) => author.user)
  authors: AuthorEntity[];
}
