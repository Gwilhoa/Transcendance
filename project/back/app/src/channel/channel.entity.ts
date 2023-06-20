import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { ChannelType } from 'src/utils/channel.enum';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany((type) => User, (user) => user.joinedChannels, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'channels_users',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];

  @ManyToMany((type) => User, (user) => user.adminChannels)
  @JoinTable({
    name: 'channels_admins',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  admins: User[];

  @ManyToMany((type) => User, (user) => user.bannedChannels)
  @JoinTable({
    name: 'channels_banned_users',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  bannedUsers: User[];

  @ManyToMany((type) => User, (user) => user.mutedChannels)
  @JoinTable({
    name: 'channels_muted_users',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  mutedUser: User[];

  @OneToMany((type) => Message, (message) => message.channel, {
    onDelete: 'CASCADE',
  })
  messages: Message[];

  @Column()
  name: string;

  @Column({ nullable: true })
  topic: string;

  @Column()
  type: ChannelType;

  @Column({ nullable: true })
  pwd: string;

  @ManyToOne((type) => User, (user) => user.createdChannels)
  creator: User;
}
