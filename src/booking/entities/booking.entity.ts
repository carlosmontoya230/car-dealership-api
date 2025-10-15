import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/interface/base.entity';

@Entity('Booking')
export class BookingEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, name: 'userId', nullable: false })
  user: string;

  @Column({ type: 'varchar', length: 100, name: 'vehicleId', nullable: false })
  vehicle: string;

  @Column({ type: 'bigint', name: 'startBooking', nullable: false })
  startDate: number;

  @Column({ type: 'bigint', name: 'endDateBooking', nullable: false })
  endDate: number;

  @Column({ type: 'varchar', length: 50, name: 'status', nullable: false })
  status: string;
}
