import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Type {
    PRIVATE_CHANNEL = 0,
    PUBLIC_CHANNEL = 1,
    PROTECTED_CHANNEL = 2,
    MP_CHANNEL = 3,
}
@Entity()
export class Channel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToMany(type => User, user => user.joinedChannels)
    users: User[];

    @ManyToMany(type => User, user => user.adminChannels)
    admins: User[];

    @ManyToMany(type => User, user => user.bannedChannels)
    bannedUsers: User[];

    @Column()
    name: string;

    @Column()
    topic: string;

    @Column()
    type: Type;

    @Column({nullable: true})
    pwd: string;

}