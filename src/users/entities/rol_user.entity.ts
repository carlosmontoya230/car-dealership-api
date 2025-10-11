import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { RolEntity } from './rol.entity';
import { BaseEntity } from '../../common/interface/base.entity';

@Entity('rol_user')
export class RolUserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, name: 'userEmail' })
  userEmail: string;

  @ManyToOne(() => UserEntity, (user) => user.rolUsers)
  user: UserEntity;

  @PrimaryColumn({ type: 'varchar', length: 100, name: 'rolId' })
  rolId: string;

  @ManyToOne(() => RolEntity, (rol) => rol.rolUsers)
  rol: RolEntity;
}
