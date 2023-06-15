import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cookies } from '../../App';
import { Channel, initialChannelState, User } from '../../pages/chat';
import { openModal } from '../../redux/modal/modalSlice';
import { RootState } from '../../redux/store';
import { setErrorLocalStorage } from '../IfError';
import { ProfilImage } from '../profil/ProfilImage';
import { ProfilName } from '../profil/ProfilName';

type listUserProps = {
  channel: Channel;
  setChannel: React.Dispatch<React.SetStateAction<Channel>>;
};

const ListAdmin = ( {channel, setChannel }: listUserProps ) => {

	return (
		<>
			{ channel.admins.map((user: User) => (
				user.id === channel.creator.id ? (
					null
				) : (
					<div 
						className='chat-admin-component' 
						key={user.id} 
					>
						<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-message-image-profil' />
						<ProfilName id={user.id} />
					</div>
				)
				))}
		</>
	);
};

const ListUser = ( {channel, setChannel }: listUserProps ) => {

	return (
		<>
			{ channel.users.map((user : User) => (
				user.id === channel.creator.id || 
				channel.admins.some((admin) => admin.id  === user.id) ? (
					null
				) : (
					<div 
						className='chat-admin-component' 
						key={user.id} 
					>
						<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-message-image-profil' />
						<ProfilName id={user.id} />
					</div>
				)
				))}
		</>
	);
};

const ListUserMp = ( { channel }: listUserProps ) => {

	return (
		<>
			{ channel.users.map((user : User) => (
					<div 
						className='chat-admin-component' 
						key={user.id} 
					>
						<ProfilImage OnClickOpenProfil={true} id={user.id} OverwriteClassName='chat-message-image-profil' />
						<ProfilName id={user.id} />
					</div>
				))}
		</>
	);
};

const Creator = ( { channel }: listUserProps ) => {

	return (
		<div 
			key={channel.creator.id}
			className='chat-creator-component'
		>
			<ProfilImage OnClickOpenProfil={true} id={channel.creator.id} OverwriteClassName='chat-message-image-profil' />
			<ProfilName id={channel.creator.id} />
		</div>
	);
};

const ListUserChannel = () => {
	const navigate = useNavigate();
	const channelId = useSelector((state: RootState) => state.conversation.id);
	const [channel, setChannel] = useState<Channel>(initialChannelState); 

	useEffect(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/channel/id/' + channelId,
			{
				headers: {Authorization: `bearer ${cookies.get('jwtAuthorization')}`,}
			})
			.then((response) => {
				console.log(response);
				setChannel(response.data);
			})
			.catch((error) => {
					if (error.response.status === 401 || error.response.status === 500) {
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
					}
			});
	}, [channelId, setChannel]);
	
	return (
		<div className='chat-list-user'>
			{ channel.type !== 3 ? ( 
				<>
					<div className='owner'>
						<h4>Owner</h4>
						<Creator channel={channel} setChannel={setChannel}/>
					</div>
					<div className='admin'>
						<h4>Admin</h4>
						<ListAdmin channel={channel} setChannel={setChannel} />
					</div>
					<div className='users'>
						<h4>Users</h4>
						<ListUser channel={channel} setChannel={setChannel} />
					</div>
				</>
			) : (
				<div className='users'>
					<h4>Users</h4>
					<ListUserMp channel={channel} setChannel={setChannel} />
				</div>
			)}
		</div>
	);
};

export default ListUserChannel;
