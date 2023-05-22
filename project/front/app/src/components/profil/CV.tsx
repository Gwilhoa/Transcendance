import './modal.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonInputToggle } from '../utils/inputButton';
import LogoutButton from './logout';
import { setErrorCookie } from "../IfError"
import axios from '../utils/API';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


export default function CV( {name, photoUrl, isFriend, isMe, closeModal } : {name:string, photoUrl:string, isFriend:boolean, isMe:boolean, closeModal:(param: boolean) => void;}) {
    const retu = [];
	const navigate = useNavigate();
    const [truename, setTrueName] = useState(name);
    const [image, setImage] = useState<string>(photoUrl);
    const [checked, setChecked] = useState(false);

	useEffect(() => {
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
	}, [navigate]);

	const changeName = (str: string) => {
			axios.post("http://localhost:3000/user/name", 
				{ name: str }, 
				{ headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`, 
				},})
				.then((response) => {
					console.log(response);
					console.log("this is name");
					setTrueName(str);
				})
				.catch((error) => {
					console.error(error);
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
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
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
            <div key={"changeName"}>
            <p/>
            <ButtonInputToggle
            onInputSubmit={changeName}
            textInButton='Change name'
            placeHolder='New name'
            classInput='button_notif'
            classButton='button_notif'/>
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
                {truename}
            </h2>
            <div>
                {retu}
            </div>
            <br/>
        </div>
    )
}
