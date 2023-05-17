import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('discord_confirmation')
export class DiscordConfirmationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'state' | 'auth';

  @Column()
  token: string;

  @Column({ nullable: true })
  memberId?: string;
}