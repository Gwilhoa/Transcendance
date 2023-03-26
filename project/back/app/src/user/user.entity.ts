import { Column, Double, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryColumn()
    id: string;

    @Column()
    username: string;

    @Column({default: 0})
    experience: number;

}
