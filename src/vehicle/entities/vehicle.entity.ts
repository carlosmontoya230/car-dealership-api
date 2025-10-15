import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/interface/base.entity';

@Entity('vehicle')
export class VehicleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, name: 'brand' })
  brand: string;

  @Column({ type: 'varchar', length: 100, name: 'model' })
  model: string;

  @Column({ type: 'int', name: 'year' })
  year: number;

  @Column({ type: 'varchar', length: 100, name: 'type' })
  type: string;

  @Column({ type: 'varchar', length: 100, name: 'carPlate' })
  carPlate: string;

  @Column({ type: 'varchar', length: 100, name: 'color' })
  color: string;

  @Column({ type: 'int', name: 'currentKm' })
  currentKm: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'status',
  })
  status: 'available' | 'rented' | 'reserved' | 'inMaintenance';

  @Column({ type: 'varchar', length: 100, name: 'country' })
  country: string;
}
