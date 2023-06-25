import './css/listUsers.css';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Channel, isAdmin, isMe, User} from '../../pages/chat';
import {ProfilImage} from '../profil/ProfilImage';
import {ProfilName} from '../profil/ProfilName';
import {openModal} from '../../redux/modal/modalSlice';
import SocketSingleton from '../../socket';
import { RootState } from '../../redux/store';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

type listUserProps = {
	channel: Channel;
};

type changeChannelProps = {
	channel: Channel
	id: string;
};

const MakeAdmin = ({id, channel}: changeChannelProps) => {

	const handleClickMakeAdmin = () => {
		socket.emit('add_admin', {channel_id: channel.id, admin_id: id});
		console.log('ON CLICK add admin');
	};

	return (
		<div className='chat-list-users-button-making-admin' onClick={handleClickMakeAdmin}>
			Admin
		</div>
	);
};

const DeleteAdmin = ({id, channel}: changeChannelProps) => {

	const handleClickDeleteAdmin = () => {
		socket.emit('remove_admin', {channel_id: channel.id, admin_id: id});
		console.log('ON CLICK Delete admin');
	};

	return (
		<div className='chat-list-users-button-deleting-admin' onClick={handleClickDeleteAdmin}>
			Remove Admin
		</div>
	);
}

const BanHammer = ({id, channel}: changeChannelProps) => {

	const handleClickBanHammer = () => {
		socket.emit('ban_user', {channel_id: channel.id, ban_id: id});
		console.log('ON CLICK ban user');
	};

	return (
		<div className='chat-list-users-button-ban-hammer' onClick={handleClickBanHammer}>
			Ban
		</div>
	);
};

const UnBanHammer = ({id, channel}: changeChannelProps) => {

	const handleClickUnbanHammer = () => {
		socket.emit('unban_user', {channel_id: channel.id, unban_id: id});
		console.log('unban user');
	};

	return (
		<div className='chat-list-users-button-unban-hammer' onClick={handleClickUnbanHammer}>
			UnBan
		</div>
	);
};

const MuteButton = ({id, channel}: changeChannelProps) => {

	const handleClickMute = () => {
		socket.emit('add_muted', {channel_id: channel.id, mute_id: id});
		console.log('mute user');
	};

	return (
		<div className='chat-list-users-button-mute' onClick={handleClickMute}>
			Mute
		</div>
	);
}

const UnMuteButton = ({id, channel}: changeChannelProps) => {

	const handleClickMute = () => {
		socket.emit('remove_muted', {channel_id: channel.id, mute_id: id});
		console.log('mute user');
	};

	return (
		<div className='chat-list-users-button-unmute' onClick={handleClickMute}>
			UnMute
		</div>
	);
}


const ListAdmin = ({channel}: listUserProps) => {
	const dispatch = useDispatch();
	const myId = useSelector((state: RootState) => state.id.id);

	return (
		<>
			{channel.admins.map((user: User) => (
				user.id === channel.creator.id ? (
					null
				) : (
					<div
						className='chat-list-users-user'
						key={user.id}
					>
						<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-list-user-image'/>
						<div className='chat-list-users-user-text'>
							<div className='chat-list-users-user-name' onClick={() => dispatch(openModal(user.id))}>
								<ProfilName id={user.id}/>
							</div>
							<div className='chat-list-users-buttons-user'>
								{ isAdmin(channel, '' + myId) && !isMe(user, '' + myId) ?
									<DeleteAdmin id={user.id} channel={channel} />
									:
									null
								}
								{ channel.creator.id === '' + myId ?
									<BanHammer id={user.id} channel={channel} />
									:
									null
								}
							</div>
						</div>
					</div>
				)
			))}
		</>
	);
};

const ListUser = ({channel}: listUserProps) => {
	const dispatch = useDispatch();
	const myId = useSelector((state: RootState) => state.id.id);

	const isMuted = (user: User, channel: Channel) => {
		console.log(channel);
		return channel.mutedUser.some((banned) => banned.id === user.id);

	}

	return (
		<>
			{channel.users.map((user: User) => (
				user.id === channel.creator.id ||
				channel.admins.some((admin) => admin.id === user.id) ? null : (
					<div
						className='chat-list-users-user'
						key={user.id}
					>
					<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-list-user-image'/>
						
					<div className='chat-list-users-user-text'>
						<div className='chat-list-users-user-name' onClick={() => dispatch(openModal(user.id))}>
							<ProfilName id={user.id}/>
							</div>
							{ isAdmin(channel, ''+myId) && !isMe(user, ''+myId) ?
								<div className='chat-list-users-buttons-user'>
									<MakeAdmin id={user.id} channel={channel} />
									<BanHammer id={user.id} channel={channel} />
									{ isMuted(user, channel) ?
										<UnMuteButton id={user.id} channel={channel} />
										:
										<MuteButton id={user.id} channel={channel} />
									}
								</div>
							:
							null
						}
						</div>
					</div>
				)
			))}
		</>
	);
};

const ListBannedUser = ({channel}: listUserProps) => {
	const dispatch = useDispatch();
	const myId = useSelector((state: RootState) => state.id.id);

	return (
		<>
			{channel.bannedUsers.map((user: User) => (
				<div
					className='chat-list-users-user'
					key={user.id}
				>
					<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-list-user-image'/>
					<div className='chat-list-users-user-text'>
						<div className='chat-list-users-user-name' onClick={() => dispatch(openModal(user.id))}>
							<ProfilName id={user.id}/>
						</div>
						{ isAdmin(channel, ''+myId) && !isMe(user, ''+myId) ?
							<div className='chat-list-users-buttons-user'>
								<UnBanHammer id={user.id} channel={channel}/>
							</div>
						:
						null}
					</div>
				</div>

			))}
		</>
	);
};

const ListUserMp = ({channel}: listUserProps) => {
	const dispatch = useDispatch();

	return (
		<>
			{channel.users.map((user: User) => (
				<div
					className='chat-list-users-user'
					key={user.id}
				>
					<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-list-user-image'/>
					<div className='chat-list-users-user-text'>
						<div className='chat-list-users-user-name' onClick={() => dispatch(openModal(user.id))}>
							<ProfilName id={user.id}/>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

const Creator = ({channel}: listUserProps) => {
	const dispatch = useDispatch();

	return (
		<div
			key={channel.creator.id}
			className='chat-list-users-user'
		>
			<ProfilImage OnClickOpenProfil={true} id={channel.creator.id} OverwriteClassName='chat-list-user-image'/>
			<div className='chat-list-users-user-text'>
				<div className='chat-list-users-user-name' onClick={() => dispatch(openModal(channel.creator.id))}>
					<ProfilName id={channel.creator.id}/>
				</div>
			</div>
		</div>
	);
};

const ListUserChannel = ({channel}: { channel: Channel }) => {

	return (
		<div className='chat-right-bar-list-user'>
			<div>
				{channel.type !== 3 ? (
					<>
						<div className='owner'>
							<h4>Owner</h4>
							<Creator channel={channel}/>
						</div>
						<div className='admin'>
							<h4>Admin</h4>
							<ListAdmin channel={channel}/>
						</div>
						<div className='users'>
							<h4>Users</h4>
							<ListUser channel={channel}/>
						</div>
						<div className='banned'>
							<h4>Banned</h4>
							<ListBannedUser channel={channel}/>
						</div>
					</>
				) : (
					<div className='users'>
						<h4>Users</h4>
						<ListUserMp channel={channel}/>
					</div>
				)}
			</div>
		</div>
	);
};

export default ListUserChannel;
