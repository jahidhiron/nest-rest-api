import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '@/modules/user/entities';
import { EntityName } from '@/shared/enums';
import { BaseEntity } from '@/common/entities';

@Entity(EntityName.LoginHistory)
export class LoginHistory extends BaseEntity {
  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar', nullable: true })
  deviceInfo?: string;

  @Column({ type: 'datetime', nullable: true })
  loggedOutAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.loginHistories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  userId: number;
}
