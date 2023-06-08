import './css/home.css'
import React, { useEffect, useState } from 'react';
import '../components/notification/notification.css'
import ErrorToken, { setErrorLocalStorage } from '../components/IfError';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cookies } from '../App';
import { IUser } from '../components/utils/interface';




const Add = () => {
    // const users = [];
    const [listUser, setListUser] = useState<Array<IUser>>([]);

    const navigate = useNavigate();
    useEffect(() =>{
        axios.get(process.env.REACT_APP_IP + ":3000/user/friend", {
            headers: {
                Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
            },
        })
        .then((res) => {
            console.log(res);
            setListUser(res.data);
        })
        .catch((error) => {
            console.error(error);
            setErrorLocalStorage(error.response.status);
            navigate('/Error');
        })
    }, [navigate]);
    if (listUser == null || listUser.length == 0)
    {
        return (<p className="no-friend">Knowing how to enjoy your own company is an art.<small>Natasha Adamo</small></p>);
    }
    console.log(listUser);
    return (
        <div className="users-list">
            {listUser.map((user) => (
                <div className="user" key={user.id}>
                    <img className='image' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img>
                    <p className="name">{user.username}</p>
                    <p className="status">Status</p>
                    <p className='xp'>5000XP</p>
                </div>
            ))}
        </div>
    );
}

const Home = () => {
        return (
            <div className='home'>
				<ErrorToken />
                <div className="scrollBlock">
                    <Add/>
                </div>
            </div>
        );

}
//<GetTokenUser url="http://localhost:3000/auth/login"/>

export default Home;

