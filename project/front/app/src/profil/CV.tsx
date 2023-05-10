import './modal.css'
import { useState } from 'react';
import { ButtonInputToggle } from '../inputButton';
import { getTwoFA, setTwoFA, setName } from '../API';


export default function CV( {name, photoUrl, isFriend, isMe } : {name:string, photoUrl:string, isFriend:boolean, isMe:boolean}) {
    const retu = [];
    const [truename, setTrueName] = useState(name);
    const [image, setImage] = useState(photoUrl);
    const [checked, setChecked] = useState(getTwoFA());

    const changeName = (str:string) => {
        if (setName(str))
            setTrueName(str);
    }

    const clicked = () => {
        setTwoFA(!checked);
        setChecked(!checked);
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
        }


        //retu.push(
          //  <div></div>
        //)

    if (!isFriend && !isMe) {
        retu.push(
            <button key={"buttonFriend"}>
                Ajouter en ami
            </button>
        )
    }

    if (isFriend && !isMe) {
        retu.push(
            <button key={"buttonInvite"}>
                Inviter à une partie
            </button>
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