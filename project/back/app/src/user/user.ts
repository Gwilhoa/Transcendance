import { Column, Double, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()


    @Column()
    experience: Double;

    

}
