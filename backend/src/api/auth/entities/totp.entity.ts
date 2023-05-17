import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('totp')
export class TotpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  uuid: string;
}