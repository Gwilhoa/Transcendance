import { User } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Type {
    PRIVATE_CHANNEL = 0,
    PUBLIC_CHANNEL = 1,
    PROTECTED_CHANNEL = 2,
    MP_CHANNEL = 3,
}
@Entity('channels')
export class Channel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToMany(type => User, user => user.joinedChannels, {cascade: true, eager: true})
    @JoinTable({ name: 'channels_users', joinColumn: { name: 'channel_id' }, inverseJoinColumn: { name: 'user_id' } })
    users: User[];

    @ManyToMany(type => User, user => user.adminChannels)
    @JoinTable({ name: 'channels_admins', joinColumn: { name: 'channel_id' }, inverseJoinColumn: { name: 'user_id' } })
    admins: User[];
    
    @ManyToMany(type => User, user => user.bannedChannels)
    @JoinTable({ name: 'channels_banned_users', joinColumn: { name: 'channel_id' }, inverseJoinColumn: { name: 'user_id' } })
    bannedUsers: User[];

    @Column()
    name: string;

    @Column({nullable: true})
    topic: string;

    @Column()
    type: Type;

    @Column({nullable: true})
    pwd: string;

}