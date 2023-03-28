import { Channel } from 'src/channel/channel.entity';
import { Column, Double, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
    CONNECTED = 0,
    DISCONNECTED = 1,
    IN_GAME = 2,
}
@Entity({name: 'users'})
export class User {

    @PrimaryColumn()
    id: string;

    @Column()
    username: string;

    @Column({default: 0})
    experience: number;

    @Column({default: 0})
    status : Status;

    @ManyToMany(type => User, user => user.friends)
    @JoinTable({ name: 'friends', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'friend_id' } })
    friends: User[];


    @ManyToMany(type => User, user => user.blockedUsers)
    blockedUsers: User[];

    @ManyToMany(type => Channel, channel => channel.users)
    joinedChannels: Channel[];

    @ManyToMany(type => Channel, channel => channel.admins)
    adminChannels: Channel[];
    
    @ManyToMany(type => Channel, channel => channel.bannedUsers)
    bannedChannels: Channel[];

}