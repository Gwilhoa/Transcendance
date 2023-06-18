import React from "react";
import {useDispatch} from "react-redux";
import {switchChatModalUpdateChannel} from "../../../../redux/chat/modalChatSlice";
import SocketSingleton from "../../../../socket";
import {cookies} from "../../../../App";
import channel from "../../Channel";
import Channel from "../../Channel";
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
const ButtonLeaveChannel = ({channelId}: {channelId: string}) => {

	function leaveChannel() {
		console.log('leave channel');
		socket.emit('leave_channel',{token : cookies.get('jwtAuthorization'), channel_id : channelId});
	}

	return (
		<div className='' onClick={() => leaveChannel()}>
			🚪
		</div>
	);
}

export default ButtonLeaveChannel;