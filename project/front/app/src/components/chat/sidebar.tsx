import './css/sidebar.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cookies } from '../../App';
import { Channel } from '../../pages/chat';
import { setConversation } from '../../redux/chat/conversationIdSlice';
import { RootState } from '../../redux/store';
import SocketSingleton from '../../socket';
import ChannelSideBar from './Channel';

function SideBarChat() {
	const [listChannel, setListChannel] = useState<Array<Channel>>([]);
	const dispatch = useDispatch();
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();

	const fetchChannel = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_IP + ':3000/user/channels', {
          headers: {
            Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
          },
        });
        console.log(response);
        setListChannel(response.data);
      } catch (error) {
        console.error(error);
      }
    };

	useEffect(() =>{
		socket.on('join_code', (data: any) => {
			console.log('join_code ' + data.code)
			console.log(data);
			fetchChannel();
			return ;
		});
	}, [socket])
	
	
	useEffect(() =>{
		fetchChannel();
	}, [])

	const handleSwitchChannel = (id: string) => {
		dispatch(setConversation(id));
		console.log('set conversation sidebar = ' + id);
	}



	return (
		<div className='chatSideBar'>
			{listChannel.map((channel) => (
				<div onClick={() => handleSwitchChannel(channel.id)} key={channel.id}>
					<ChannelSideBar channelId={channel.id} />
				</div>
			))}
		</div>
	);
}
export default SideBarChat;
