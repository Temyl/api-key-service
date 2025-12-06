import { BaseEntity } from "src/shared/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { PaymentStatus } from "src/shared/enums";

@Entity('payment')
export class PaymentEntity extends BaseEntity {

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ unique: true })
    reference: string;

    @Column()
    amount: number;

    @Column({ 
        type: 'enum', 
        enum: PaymentStatus, 
        default: PaymentStatus.PENDING  
    })
    status: PaymentStatus;

    @Column({ 
        nullable: true,
        type: 'timestamp'
     })
    paidAt: Date;
}

