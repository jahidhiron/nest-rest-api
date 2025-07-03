import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@/modules/user/entities';
import { EntityName } from '@/shared/enums';

@Entity(EntityName.LoginHistory)
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => "datetime('now')" })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => "datetime('now')" })
  updatedAt: Date;

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
