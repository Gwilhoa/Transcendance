import '../css/CreateChannel.css'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { switchChatModalCreateChannel } from '../../../redux/chat/modalChatSlice';
import { Channel } from '../../../pages/chat';
import { ButtonInputToggle } from '../../utils/inputButton';
import { cookies } from '../../../App';
import axios from 'axios';
import { setConversation } from '../../../redux/chat/conversationIdSlice';
import SocketSingleton from '../../../socket';
import { Search } from '../../search/userSearch';
import { IUser } from '../../utils/interface';
import { useNavigate } from 'react-router-dom';
import { openModal } from '../../../redux/modal/modalSlice';
import { setErrorLocalStorage } from '../../IfError';
import { RootState } from '../../../redux/store';
import { ProfilImage } from '../../profil/ProfilImage';
import { ProfilName } from '../../profil/ProfilName';
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();


const initialState: Channel= {
	id: '',
	name: 'New Channel',
	topic: null,
	type: 0,
	pwd: null,
	users: [],
}

type AddUserIdProps = {
  usersId: Array<string>;
  setUserId: React.Dispatch<React.SetStateAction<Array<string>>>;
};

const AddUserId = ({ usersId, setUserId }: AddUserIdProps) => {
    const [listUser, setListUser] = useState<Array<IUser> | null >([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    console.log('Add');
    const searchUser = (useSelector((state: RootState) => state.searchUser.users));
    useEffect(() => {
        setListUser(searchUser);
    },[searchUser]);

    console.log(listUser?.length);
    if (listUser == null)
        console.log('listUser null');
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
        if (listUser == null)
        {
            refresh();
        }
    }, [listUser, refresh]);
    
	const handleOnClick = (id: string) => {
		setUserId((prevListId) => {
			if(!prevListId.some((idInList) => id === idInList)) {
				return [...prevListId, id];
			}
			return prevListId;
		});
		console.log('here');
		console.log(usersId);
	};

    if (listUser == null || listUser.length == 0)
    {
        return (<></>);
    }
    console.log(listUser);
    return (
        <div className='users-list'>
            {listUser.map((user) => (
				!usersId.includes(user.id) ? (
					<div className='user' key={user.id} onClick={() => handleOnClick(user.id)}>
						<ProfilImage id={user.id} OnClickOpenProfil={false} diameter='' />
						<ProfilName  id={user.id} />
					</div>
				) : (
					<div key='notUser'></div>
				)
            ))}
        </div>
    );
}


const CreateChannel = () => {
	const dispatch = useDispatch();
	const [channelParams, setChannelParams] = useState<Channel>(initialState);
	const [usersId, setUserId] = useState<Array<string>>([]);

	const onSubmitChannelName = (str: string) => {
		setChannelParams((prevChannelParams) => ({
			...prevChannelParams,
			name: str,
		}));	
	};

	const handlePasswordChange = (str:string) => {
		setChannelParams((prevChannelParams) => ({
			...prevChannelParams,
			pwd: str,
		}));
	};

	const handleChannelTypeChange = (type: number) => {
		setChannelParams((prevChannelParams) => ({
			...prevChannelParams,
			type: type,
		}));
	};

	const handleNewChannel = () => {
		console.log('send');
		console.log(channelParams);
		axios.post(process.env.REACT_APP_IP + ':3000/channel/create',
			{
				name: channelParams.name,
				creator_id: localStorage.getItem('id'), 
				type: channelParams.type,
				password: channelParams.pwd,
			},
			{
				headers: {Authorization: `bearer ${cookies.get('jwtAuthorization')}`,}
			})
			.then((response) => {
				console.log(response);
				socket.emit('join_channel', {channel_id: response.data.id});
				usersId.map((userId) =>{
					socket.emit('invite_channel', {receiver_id: userId, channel_id: response.data.id});
				});
				dispatch(switchChatModalCreateChannel());
			})
			.catch((error) => {
				console.error(error)
			});
		return;
	};

	return (
	<div className='page-shadow'>
		<div className='create-channel'>
			<h2>Create Channel</h2>
			<h3>Channel Name</h3>
			<button className='close-create-channel' onClick={() => dispatch(switchChatModalCreateChannel())} />
			<input className='channel-name-input' type='text' placeholder='Channel Name' value={channelParams.name} onChange={(e) => onSubmitChannelName(e.target.value)}/>
			<div className='ButtonChangeTypeChannel'>
				<h3>Channel Type</h3>
				<button className='channel-type-button' onClick={() => handleChannelTypeChange(0)}>Private</button>
				<button className='channel-type-button' onClick={() => handleChannelTypeChange(1)}>Public</button>
				<button className='channel-type-button' onClick={() => handleChannelTypeChange(2)}>Protected</button>
			</div>
			{channelParams.type === 2 ? (
			<>
				<div className='divInputPassword'>
					<h3>Password</h3>
					<input
						className='channel-password-input'
						placeholder='Password'
						type='password'
						id='password'
						onChange={() => handlePasswordChange}
					/>
				</div>
			</>
			) : (<></>)}
			{channelParams.type === 0 ? (
			<>
				<div className='divFindUser'>
					<h6>Invite some people:</h6>
					<Search defaultAllUsers={true}/>
					<AddUserId usersId={usersId} setUserId={setUserId}/>
				</div>
			</>
			) : (<></>)}

			<button className='channel-create-channel-button' onClick={() => handleNewChannel()}>New Channel</button>
		</div>
	</div>
	);
}

export default CreateChannel;
