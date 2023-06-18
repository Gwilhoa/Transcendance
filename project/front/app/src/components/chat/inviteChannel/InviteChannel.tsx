import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {cookies} from '../../../App';
import {Channel} from '../../../pages/chat';
import {switchChatModalInviteChannel} from '../../../redux/chat/modalChatSlice';
import {RootState} from '../../../redux/store';
import SocketSingleton from '../../../socket';
import {setErrorLocalStorage} from '../../IfError';
import {ProfilImage} from '../../profil/ProfilImage';
import {ProfilName} from '../../profil/ProfilName';
import {Search} from '../../search/userSearch';
import {IUser} from '../../utils/interface';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

type AddUserIdProps = {
	usersId: Array<string>;
	setUserId: React.Dispatch<React.SetStateAction<Array<string>>>;
	channelId: string;
};

const AddUserId = ({usersId, setUserId, channelId}: AddUserIdProps) => {
	const [listUser, setListUser] = useState<Array<IUser> | null>([]);

	const navigate = useNavigate();

	const searchUser = (useSelector((state: RootState) => state.searchUser.users));
	useEffect(() => {
		setListUser(searchUser);
	}, [searchUser]);

	const refresh = useCallback(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/user/friend', {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((res) => {
				console.log(res);
				setListUser(res.data);
			})
			.catch((error) => {
				console.error(error);
				setErrorLocalStorage(error.response.status);
				navigate('/Error');
			})
	}, [navigate]);

	useEffect(() => {
		if (listUser == null) {
			refresh();
		}
	}, [listUser, refresh]);

	const handleOnClick = (id: string) => {
		setUserId((prevListId) => {
			if (!prevListId.some((idInList) => id === idInList)) {
				return [...prevListId, id];
			}
			return prevListId;
		});
		socket.emit('invite_channel', {receiver_id: id, channel_id: channelId});
	};

	if (listUser == null || listUser.length == 0) {
		return (null);
	}
	console.log(listUser);
	return (
		<div className='users-list'>
			{listUser.slice(0, 6).map((user) => (
				!usersId.includes(user.id) ? (
					<div key={user.id} onClick={() => handleOnClick(user.id)}>
						<ProfilImage id={user.id} OnClickOpenProfil={false}
							OverwriteClassName='chat-side-bar-invite-channel-user-image'/>
						<ProfilName id={user.id}/>
					</div>
				) : null
			))}
		</div>
	);
}


const InviteChannel = ({channel}: { channel: Channel }) => {
	const dispatch = useDispatch();
	const [usersId, setUserId] = useState<Array<string>>([]);

	useEffect(() => {
		channel.users.map((element: IUser) => {
			setUserId((prevList) => [...prevList, element.id]);
		});
	}, []);

	return (
		<div className='page-shadow'>
			<div className='create-channel'>
				{channel.type !== 3 ? (
					<>
						<h2>Invite some people</h2>
						<button
							className='chat-side-bar-close-add-people-channel'
							onClick={() => dispatch(switchChatModalInviteChannel())}
						/>
						<div className='chat-side-bar-invite-channel'>
							<Search defaultAllUsers={true} OverwriteClassName={'chat-side-bar-invite-channel-input'}/>
							<AddUserId
								usersId={usersId}
								setUserId={setUserId}
								channelId={channel.id}
							/>
						</div>
					</>
				) : (
					<div>
						{"You can't acces to this fonctionnality"}
						<button className='close-create-channel'
								onClick={() => dispatch(switchChatModalInviteChannel())}/>
					</div>
				)}
			</div>
		</div>
	);
};

export default InviteChannel;
