import { Column, CreateDateColumn, Entity, Generated, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { AssetsEntity } from "./assets.entity";

@Entity('users')
export class UsersEntity {
    @PrimaryColumn()
    @Generated('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    memberId: string;

    @Column({ nullable: true })
    totp: string | null;

    @OneToMany(() => AssetsEntity, asset => asset.user, { eager: true })
    assets: AssetsEntity[];

    @CreateDateColumn()
    registered: Date;
}
