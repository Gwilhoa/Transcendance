import './profil.css'
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonInputToggle } from '../utils/inputButton';
import LogoutButton from './logout';
import { setErrorLocalStorage } from "../IfError"
import axios, { socket } from '../utils/API';
import Cookies from 'universal-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { closeModal } from '../../redux/modal/modalSlice';
const cookies = new Cookies();


export default function Profil() {
	const initialElement = [];
	const navigate = useNavigate();
	const [isMe, setIsMe] =  useState<boolean>(false);
	const [isFriend, setIsFriend] =  useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [checked, setChecked] = useState(false);
	const [errorName, setErrorName] = useState<boolean>(false);
	const id = useSelector((state: RootState) => state.modal.id);
	const dispatch = useDispatch();

	console.log(id);
	const refresh = useCallback(( id: string | null ) => {
		axios.get(process.env.REACT_APP_IP + ":3000/user/image/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setImage(data);
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
				dispatch(closeModal());
			});

		axios.get(process.env.REACT_APP_IP + ":3000/user/id/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				setName(response.data.username);
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
				dispatch(closeModal());
			});
		axios.post(process.env.REACT_APP_IP + ":3000/user/isfriend", 
		{ friend_id: id },
		{
			headers: { Authorization:  `Bearer ${cookies.get('jwtAuthorization')}`, },
		})
			.then((Response) => {
				console.log(Response);
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
	}, [navigate, dispatch]);

	socket.on('friend_code', (data: any) => {
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
					refresh(id);
				})
				.catch((error) => {
					console.error(error);
				});
			return;
		}
		return;
	})

	socket.on('friend_request', (data: any) => {
		console.log("receive friend code " + data.code + " " + data.id + " " + id);
		if (data.code === 2 && data.id === id && !isFriend) {
			refresh(id);
			return;
		}
		return;
	})

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
					refresh(id)
				})
				.catch((error) => {
					console.error(error);
					setErrorName(true);
				});
    }

    const clicked = () => {
		if (checked === false) {
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
				.then(() => {
					refresh(id);
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
		// socket.emit('friend_request', { friend_id: id });
	};

	initialElement.push(
        <div key={"image"}>
            <img className='circle-image' src={image} alt="selected" />
            <br/> <br/>
        </div>
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
				{ isMe === false ? (
					<>
						{ isFriend  === false ? (
							<div className='other-user-profil'>
								<button onClick={() => handleAddFriend(id)}>
									Add friend
								</button>
								<br/>
								<button>
									Challenge
								</button>
							</div>
						) : (
							<div className='other-user-profil'>
								<button onClick={() => handleAddFriend(id)}>
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

