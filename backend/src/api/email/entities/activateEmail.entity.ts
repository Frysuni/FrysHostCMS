import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('activate_email')
export class ActivateEmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;
}