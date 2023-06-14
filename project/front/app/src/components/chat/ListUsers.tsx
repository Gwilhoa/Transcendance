import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cookies } from '../../App';
import { Channel, initialChannelState } from '../../pages/chat';
import { openModal } from '../../redux/modal/modalSlice';
import { RootState } from '../../redux/store';
import { setErrorLocalStorage } from '../IfError';

type listUserPros = {
  channel: Channel;
  setChannel: React.Dispatch<React.SetStateAction<Channel>>;
};

const ListAdmin = ( {channel, setChannel }: listUserPros ) => {
	const dispatch = useDispatch();

	return (
		<>
			{ channel.admins.map((user) => (
				user.id === channel.creator.email ? (
					<></>
				) : (
					<div 
						className="chat-admin-component" 
						key={user.id} 
						onClick={() => dispatch(openModal(user.id))}
					>
						{user.username}
					</div>
				)
				))}
		</>
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
	}, [channelId]);
	
	return (
		<div className="chat-list-user">
			{ channel.type !== 3 ? ( 
				<>
					<div className="owner">
						<h4>Owner</h4>
						{channel.creator.username}
					</div>
					<div className="admin">
						<h4>Admin</h4>
						<ListAdmin channel={channel} setChannel={setChannel} />
					</div>
					<div className="users">
						<h4>Users</h4>
					</div>
				</>
			) : (
				<div className="users">
					<h4>Users</h4>
				</div>
			)}
		</div>
	);
};

export default ListUserChannel;
