import React, { useState } from "react"
import { useDispatch } from "react-redux";
import { switchChatModalCreateChannel } from "../../../redux/chat/modalChatSlice";
import "../css/CreateChannel.css"
import { Channel } from "../../../pages/chat";
import { ButtonInputToggle } from "../../utils/inputButton";

const initialState: Channel= {
	id: '',
	name: 'New Name',
	topic: null,
	type: 0,
	pwd: null,
	users: [],
}
const CreateChannel = () => {
	const dispatch = useDispatch();
	const [channelParams, setChannelParams] = useState<Channel>(initialState);

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
	};

	const getTypeLabel = (type: number) => {
		switch (type) {
			case 0:
				return "Private";
			case 1:
				return "Public";
			case 2:
				return "Protected";
			default:
				return "";
		}
	};

	return (
	<div className="PageShadow">
		<div className="CreateChannel">
			<h2>Create Channel</h2>
			<br />
			{channelParams.name}
			<br />
			<button className="CloseCreateChannel" onClick={() => dispatch(switchChatModalCreateChannel())} />
			<ButtonInputToggle
					onInputSubmit={onSubmitChannelName}
					textInButton='Channel name'
					placeHolder='Channel name'
					classInput=''
					classButton=''
			/>
			<br />
			<div className="ButtonChangeTypeChannel">
				<h3>Channel Type: {getTypeLabel(channelParams.type)}</h3>
				<button onClick={() => handleChannelTypeChange(0)}>Private</button>
				<button onClick={() => handleChannelTypeChange(1)}>Public</button>
				<button onClick={() => handleChannelTypeChange(2)}>Protected</button>
			</div>
			{channelParams.type === 2 ? (
			<>
				<br />
				<div className="divInputPassword">
					<h3>Password</h3>
					<input
						type="password"
						id="password"
						onChange={() => handlePasswordChange}
					/>
				</div>
			</>
			) : (<></>)}
			<br />
			<button onClick={() => handleNewChannel}>New Channel</button>
		</div>
	</div>
	);
}

export default CreateChannel;
