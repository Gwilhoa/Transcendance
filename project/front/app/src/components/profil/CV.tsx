import './modal.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonInputToggle } from '../utils/inputButton';
import LogoutButton from './logout';
import { setErrorCookie } from "../IfError"
import axios from '../utils/API';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


export default function CV( { id, closeModal } : { id:string, closeModal:(param: boolean) => void; }) {
    const retu = [];
	const navigate = useNavigate();
	const [isMe, setIsMe] =  useState<boolean>(false);
	const [isFriend, setIsFriend] =  useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [checked, setChecked] = useState(false);
	const [errorName, setErrorName] = useState<boolean>(false);


	const refresh = (id:string) => {
		axios.get("http://localhost:3000/user/image/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setImage(data);
			})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});

		axios.get("http://localhost:3000/user/id/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				setName(response.data.username);
			})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	};

	useEffect(() => {
		axios.get("http://localhost:3000/user/id", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				console.log(response);
				if (id === response.data.id) {
					setIsMe(true);
					console.log("this is me");
				}
			})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});

		refresh(id);
		
		axios.get("http://localhost:3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				if (response.data == false)
					setChecked(false);
				else
					setChecked(true);
				console.log(response.data);
			})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}, [navigate, id]);

	const changeName = (str: string) => {
			axios.post("http://localhost:3000/user/name", 
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
			closeModal(false);
		}
		else {
			axios.get("http://localhost:3000/auth/2fa/disable", {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					setErrorCookie("Error " + error.response.status);
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
				url: 'http://localhost:3000/user/image',
				headers: {
					'Authorization': `Bearer ${cookies.get('jwtAuthorization')}`,
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
			})
				.then(response => {
					console.log(response.data);
					refresh(id);
				})
				.catch(error => {
					console.error(error);
				});
		}
	};

	retu.push(
        <div key={"image"}>
            <img className='circle-image' src={image} alt="selected" />
            <br/> <br/>
        </div>
    )
    
    if (isMe) {
        retu.push(
            <input type="file" onChange={handleImageChange} key={"changeImage"}/>
        )
        
        retu.push(
            <div key={"changeName"} className="ChangeNameDiv">
				<p/>
					<ButtonInputToggle
					onInputSubmit={changeName}
					textInButton='Change name'
					placeHolder='New name'
					classInput='button_notif'
					classButton='button_notif'
					/>
				{errorName ? <p className="errorName">Already Exist</p> : <></>}
            </div>
            )
            
        retu.push(
                <div key={"change2FA"}>
                <p/>
                <input type='checkbox' name='2FA' checked={checked} onChange={clicked}  />
                <label htmlFor="scales">2FA</label>
                </div>
            )
		retu.push(
			<div key={"logout"}>
				<LogoutButton closeModal={closeModal} />
			</div>	
		)
	}

    if (!isFriend && !isMe) {
        retu.push(
			<>
				<button key={"buttonFriend"}>
					Add friend
				</button>
				<button key={"buttonInvite"}>
					Challenge
				</button>
			</>
		)
    }

    if (isFriend && !isMe) {
        retu.push(
			<>
				<button key={"buttonFriend"}>
					Unfriend
				</button>
				<button key={"buttonInvite"}>
					Challenge
				</button>
			</>
		)
    }

    return (
        <div className="modalCorps">
            <h2>
                {name}
            </h2>
            <div>
                {retu}
            </div>
            <br/>
        </div>
    )
}
