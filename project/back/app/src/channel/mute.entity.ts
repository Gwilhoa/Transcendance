import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { User } from '../user/user.entity';
import { Channel } from './channel.entity';

@Entity()
export class Mute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany((type) => User, (mute) => mute.mutedChannels)
  mutedUser: User;

  @ManyToOne((type) => Channel, (channel) => channel.mutedUsers)
  mutedChannel: Channel;

  @Column()
  date: Date;
}
