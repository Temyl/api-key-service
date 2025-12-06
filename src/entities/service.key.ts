import { BaseEntity } from 'src/shared/base.entity';
import { Entity, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('service_key')
export class ApiKey extends BaseEntity {

    @Column({
        unique: true,
        name: 'key'
    })
    key: string;

    @Column({
        name: 'name'
    })
    name: string;

    @Column({
        name: 'active',
        default: true
    })
    active: boolean;

    @Column({
        name: 'expires_at',
        type: 'timestamp',
        nullable: true
    })
    expiresAt: Date | null;

    @ManyToOne(() => User, (u) => u.apiKeys, { nullable: true, onDelete: 'SET NULL' })
    owner?: User;
}
