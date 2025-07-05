import { BaseEntity } from '@/common/entities';
import { UserEntity } from '@/modules/user/entities';
import { EntityName } from '@/shared/enums';
import { Entity, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';

@Entity(EntityName.VerificationToken)
export class VerificationTokenEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  ip: string;

  @Column()
  expiredAt: Date;

  @Column({ default: false })
  applied: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column()
  type: string;

  @ManyToOne(() => UserEntity, (user) => user.verificationTokens, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @RelationId((token: VerificationTokenEntity) => token.user)
  userId: number;
}
