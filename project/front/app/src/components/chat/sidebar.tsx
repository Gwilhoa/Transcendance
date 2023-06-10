import axios from "axios";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { cookies } from "../../App";
import { Channel } from "../../pages/chat";
import { setConversation } from "../../redux/chat/conversationIdSlice";
import { RootState } from "../../redux/store";
import { socket } from "../utils/API";
import "./css/sidebar.css"

function SideBarChat() {
	const [listChannel, setListChannel] = useState<Array<Channel>>([]);
	const dispatch = useDispatch();
	const conversationId = useSelector((state: RootState) => state.conversation.id);

	useEffect(() =>{
		socket.on('join_code', (data: any) => {
			console.log(data);
			fetchChannel();
			return ;
		});
	}, [socket])
	
	const fetchChannel = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_IP + ':3000/channel', {
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
		fetchChannel();
		console.log(conversationId)
	},[])

	const handleSwitchChannel = (id: string) => {
		dispatch(setConversation(id));
		console.log(conversationId);
	}

	return (
		<div className="chatSideBar">
			{listChannel.map((channel) => (
				<button onClick={() => handleSwitchChannel(channel.id)} key={channel.id}>
					{channel.name}
				</button>
			))}
		</div>
	);
}
export default SideBarChat;
