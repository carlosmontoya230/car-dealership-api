import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/interface/base.entity';
import { RolUserEntity } from './rol_user.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @OneToMany(() => RolUserEntity, (rolUser) => rolUser.user)
  rolUsers: RolUserEntity[];

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  codeVerify: string | null;

  @Column({ type: 'bit', default: false })
  verified: boolean;
}
