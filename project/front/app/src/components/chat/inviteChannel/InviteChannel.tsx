import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cookies } from '../../../App';
import { switchChatModalInviteChannel } from '../../../redux/chat/modalChatSlice';
import { RootState } from '../../../redux/store';
import { setErrorLocalStorage } from '../../IfError';

const InviteChannel = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const channelId = useSelector((state: RootState) => state.conversation.id);

	useEffect(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/channel/id/' + channelId,
			{
				headers: {Authorization: `bearer ${cookies.get('jwtAuthorization')}`,}
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
					if (error.response.status === 401 || error.response.status === 500) {
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
					}
			});
	},[]);
	
	return (
		<div className='page-shadow'>
			<div className='create-channel'>
				<h2>Invite some people</h2>
				<button className='close-create-channel' onClick={() => dispatch(switchChatModalInviteChannel())} />
			</div>
		</div>
	);
};

export default InviteChannel;
