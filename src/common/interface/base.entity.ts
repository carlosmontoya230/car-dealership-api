import { Column, PrimaryColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Column({ type: 'bigint', name: 'createdDate' })
  createdDate: number;

  @Column({ type: 'bigint', name: 'lastUpdateDate' })
  lastUpdateDate: number;

  @Column({ type: 'bigint', default: 1, name: 'version' })
  version: number;

  @Column({ type: 'bigint', default: 1, name: 'isActive' })
  isActive: number;
}
