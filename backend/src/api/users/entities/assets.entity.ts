import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";

@Entity('assets')
export class AssetsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersEntity, user => user.assets)
    user: string;

    @Column()
    type: 'skin' | 'cloak';

    @Column()
    hd: boolean;

    @Column({ nullable: true })
    slim: boolean | null;
}
