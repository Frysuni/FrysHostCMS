import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sessions')
export class SessionsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    expiresAt: number;
}
