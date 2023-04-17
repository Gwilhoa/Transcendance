import './modal.css'
import { useState } from 'react';


export default function CV( {name, photoUrl, isFriend, isMe } : {name:string, photoUrl:string, isFriend:boolean, isMe:boolean}) {
    
    const retu = [];
    const [image, setImage] = useState(photoUrl);

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
    }

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
            <h1>
                Name : {name}
            </h1>
            <div>
                {retu}
            </div>
            <br/>
        </div>
    )
}