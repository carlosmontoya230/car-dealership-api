import { Entity, Column, OneToMany } from 'typeorm';
import { RolUserEntity } from './rol_user.entity';
import { BaseEntity } from '../../common/interface/base.entity';

@Entity('rol')
export class RolEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => RolUserEntity, (rolUser) => rolUser.rol)
  rolUsers: RolUserEntity[];
}
