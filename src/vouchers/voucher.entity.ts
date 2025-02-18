import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Customer } from 'src/customer/customer.entity';
import { SpecialOffer } from 'src/special-offers/special-offers.entity';

@Entity()
export class Voucher {
  @PrimaryColumn()
  code: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => SpecialOffer)
  specialOffer: SpecialOffer;

  @Column()
  expirationDate: Date;

  @Column({ nullable: true })
  usedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
