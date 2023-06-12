import './profil.css'
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonInputToggle } from '../utils/inputButton';
import LogoutButton from './logout';
import { setErrorLocalStorage } from "../IfError"
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { closeModal } from '../../redux/modal/modalSlice';
import { ProfilImage } from "./ProfilImage";
import axios from 'axios';
import SocketSingleton from "../../socket";
const cookies = new Cookies();
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();


export default function Profil() {
	const initialElement = [];
	const navigate = useNavigate();
	const [isMe, setIsMe] =  useState<boolean>(false);
	const [isFriend, setIsFriend] =  useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [checked, setChecked] = useState(false);
	const [errorName, setErrorName] = useState<boolean>(false);
	const [victories, setVictory] = useState<number>(0);
	const [defeats, setDefeat] = useState<number>(0);
	const [experience, setExperience] = useState<number>(0);
	const [hasFriendRequest, setHasFriendRequest] = useState<number>(0);
	const id = useSelector((state: RootState) => state.modal.id);
	const dispatch = useDispatch();

	console.log(id);
	const refresh = useCallback(( id: string | null ) => {

		axios.get(process.env.REACT_APP_IP + ":3000/user/id/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				console.log(response.data);
				setName(response.data.username);
				setVictory(response.data.victories);
				setDefeat(response.data.defeats);
				setExperience(response.data.experience);
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
				dispatch(closeModal());
			});
		axios.post(process.env.REACT_APP_IP + ":3000/user/isfriend",
			{friend_id: id},
			{
				headers: {Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,},
			})
			.then((Response) => {
				setIsFriend(Response.data.isfriend);
			})
			.catch((error) => {
				console.error(error);
				if (error.response.status === 401 || error.response.status === 500) {
					setErrorLocalStorage("Error " + error.response.status);
					navigate('/Error');
					dispatch(closeModal());
				}
			})
		axios.get(process.env.REACT_APP_IP + ":3000/user/friend/request", {
			headers: { Authorization: `Bearer ${cookies.get('jwtAuthorization')}`, },
		}).then((Response) => {
			for (const request of Response.data) {
				console.log(request);
				if (request.sender.id === id) {
					setHasFriendRequest(1);
					return;
				}
				if (request.sender.id === localStorage.getItem('id') && request.receiver.id === id) {
					setHasFriendRequest(2);
					return;
				}
			}
		});
	}, [navigate, dispatch]);

	useEffect(() => {
		socket.on('receive_challenge', (data: any) => {
			console.log('receive_challenge');
		});
		socket.on('friend_code', (data: any) => {
			console.log(data.code);
			if (data.code === 2 && !isFriend) {
				axios.post(process.env.REACT_APP_IP + ':3000/channel/mp/create',
					{
						user_id: '' + id,
					},
					{
						headers: {
							Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
						},
					})
					.then((response) => {
						console.log(response);
					})
					.catch((error) => {
						console.error(error);
						setErrorLocalStorage("Error " + error.response.status);
						navigate('/Error');
					});
				setIsFriend(!isFriend);
				return;
			}
			else if (data.code === 5 || data.code === 7) {
				setIsFriend(!isFriend);
			}
			return;
		})

		socket.on('friend_request', (data: any) => {
			console.log('friend request => ' + data.code);
			if (data.id == id && (data.code == 2 || data.code == 7 || data.code == 5)) {
				setIsFriend(!isFriend);
				return;
			}
			return;
		})
	}, [socket])

	useEffect(() => {
		if (id === localStorage.getItem('id')) {
			setIsMe(true);
		}
		refresh(id);
		
		axios.get(process.env.REACT_APP_IP + ":3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				if (response.data == false)
					setChecked(false);
				else
					setChecked(true);
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
				dispatch(closeModal());
			});
	}, [navigate, id, refresh, dispatch]);

	const changeName = (str: string) => {
			axios.post(process.env.REACT_APP_IP + ":3000/user/name",
				{ name: str }, 
				{ headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`, 
				},})
				.then(() => {
					setErrorName(false);
					setName(str);
				})
				.catch((error) => {
					console.error(error);
					setErrorName(true);
				});
    }

    const clicked = () => {
		if (!checked) {
			navigate('/CreateTwoFa');
			dispatch(closeModal());
		}
		else {
			axios.get(process.env.REACT_APP_IP + ":3000/auth/2fa/disable", {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.catch((error) => {
					setErrorLocalStorage("Error " + error.response.status);
					console.error(error);
					navigate('/Error');
				});
			setChecked(false);
		}
    }

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('image', file);

			axios({
				method: 'post',
				url: process.env.REACT_APP_IP + ':3000/user/image',
				headers: {
					'Authorization': `Bearer ${cookies.get('jwtAuthorization')}`,
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
			})
				.catch((error) => {
					setErrorLocalStorage("Error " + error.response.status);
					console.error(error);
					navigate('/Error');
				});
		}
	};

	const handleAddFriend = (id: string | null) => {
		console.log("add friend " + id);
		socket.emit('friend_request', { friend_id: id });
	};

	const handleUnFriend = (id: string | null) => {
		console.log("add friend " + id);
		socket.emit('unfriend_request', { friend_id: id });
	};

	const handlechallenge = (id: string | null) => {
		console.log("challenge " + id);
		socket.emit('challenge', { rival_id: id });
	}

	initialElement.push(
        <ProfilImage id = {'' + id} diameter = '50'/>
    )
    
    if (isMe) {
        initialElement.push(
			<div className="browse-file" key={"changeImage"}>
				<input type="file" onChange={handleImageChange} id="files"/>
				<label htmlFor="files" className='profil-button'>Change image</label>
			</div>

        )
        
        initialElement.push(
            <div key={"changeName"} className="ChangeNameDiv">
					<ButtonInputToggle
					onInputSubmit={changeName}
					textInButton='Change name'
					placeHolder='New name'
					classInput='profil-button'
					classButton='profil-button'
					/>
				{errorName ? <p className="Error-msg">*Name already Exist</p> : <></>}
            </div>
            )
            
        initialElement.push(
			<div className='change2FA' key="2FA">
				<label className="switch">
					<input type='checkbox' name='2FA' checked={checked} onChange={clicked} />
					<span className='slider'></span>
				</label>
				<p>2FA</p>
			</div>
            )
		initialElement.push(
			<div key={"logout"} className="logout">
				<LogoutButton/>
			</div>	
		)
	}

    return (
        <div className="profil-modal">
			<div className='profil-title'>
				<button className="close-profil" onClick={() => dispatch(closeModal())}></button>
				<h2> {name} </h2>
			</div>
            <div> 
				{initialElement}
				<div className='result-profil'>
					<h3>Result</h3>
					<p>Win: {victories}  - Loose: {defeats}</p>
					<p>experiences : {experience}</p>
				</div>
				{ !isMe ? (
					<>
						{ !isFriend ? (
							<div className='other-user-profil'>
								<button onClick={() => handleAddFriend(id)}>
									{ hasFriendRequest == 1 ? "accept request" : hasFriendRequest == 2 ? "waiting" : "add friend" }
								</button>
								<br/>
								<button onClick={() => handlechallenge(id)}>
									Challenge
								</button>
							</div>
						) : (
							<div className='other-user-profil'>
								<button onClick={() => handleUnFriend(id)}>
									Unfriend
								</button>
								<br/>
								<button>
									Challenge
								</button>
							</div>
						)}
					</>
				) : (<></>)}
			</div>
            <br/>
        </div>
    )
}

