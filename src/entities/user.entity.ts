import { BaseEntity } from "src/shared/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ApiKey } from "./service.key";

@Entity('users')
export class User extends BaseEntity {
    @Column({ 
        name: 'email',
        unique: true })
    email: string;

    @Column({ 
        name: 'password', 
        nullable: true 
    })
    passwordHash: string;

    @Column({
        name: 'full_name',
        nullable: true
    })
    fullName: string;

    @OneToMany(() => ApiKey, (k) => k.owner)
    apiKeys: ApiKey[];
}