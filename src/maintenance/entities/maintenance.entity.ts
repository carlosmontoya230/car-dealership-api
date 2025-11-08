import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/interface/base.entity';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity';
import { UserEntity } from '../../users/entities/users.entity';

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('maintenance')
export class MaintenanceEntity extends BaseEntity {
  @ManyToOne(() => VehicleEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

  @Column({ type: 'bigint', name: 'startDate', nullable: false })
  startDate: number;

  @Column({ type: 'bigint', name: 'endDate', nullable: true })
  endDate: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'cost',
    nullable: false,
  })
  cost: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'responsibleId' })
  responsible: UserEntity;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'status',
    default: MaintenanceStatus.PENDING,
  })
  status: MaintenanceStatus;
}
