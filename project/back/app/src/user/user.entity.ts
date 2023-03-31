import { Channel } from 'src/channel/channel.entity';
import { Message } from 'src/channel/message.entity';
import { Column, Double, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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
    email: string;

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
    @JoinTable({ name: 'blocked_users', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'blocked_user_id' } })
    blockedUsers: User[];

    @ManyToMany(type => Channel, channel => channel.users)
    joinedChannels: Channel[];

    @ManyToMany(type => Channel, channel => channel.admins)
    adminChannels: Channel[];
    
    @ManyToMany(type => Channel, channel => channel.bannedUsers)
    bannedChannels: Channel[];

    @OneToMany(type => Message , message => message.user)
    messages: Message[];

    @Column({nullable: true})
    secret2FA: string;
}