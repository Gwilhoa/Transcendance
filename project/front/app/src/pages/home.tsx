import './css/home.css'
import React, { useCallback, useEffect, useState } from 'react';
import '../components/notification/notification.css'
import ErrorToken, { setErrorLocalStorage } from '../components/IfError';
import { Navigate, useNavigate } from 'react-router-dom';
import axios, { socket } from '../components/utils/API';
import { cookies } from '../App';
import { IUser } from '../components/utils/interface';


const Search = () => {
    const navigate = useNavigate();
    useEffect(() => {
        socket.emit('research_name', {name: 'jc'});
    }, [navigate]);
    
    socket.on('research_name', (data: any) => {
        console.log('research_name');
        console.log(data);
        return;
    })
        return (
        <input type='search' placeholder='Search'></input>
    );
}

const Add = () => {
    const [listUser, setListUser] = useState<Array<IUser>>([]);

    const navigate = useNavigate();
    const refresh = useCallback(() => {
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
    
	socket.on('friend_code', (data: any) => {
        if (data.code == 2) {
            refresh()
            return;
        }
		else if (data.code === 5 || data.code === 7) {
			refresh();
		}
        return;
    })
    
    socket.on('friend_request', (data: any) => {
        if (data.code == 2 || data.code == 7) {
            refresh();
            return;
        }
        return;
    })
    
    useEffect(() =>{
        refresh();
    }, [navigate]);


    if (listUser == null || listUser.length == 0)
    {
        return (<p className="no-friend">Knowing how to enjoy your own company is an art. <span>Natasha Adamo</span></p>);
    }
    console.log(listUser);
    return (
        <div className="users-list">
            {listUser.map((user) => (
                <div className="user" key={user.id}>
                    <img className='image' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img>
                    <p className="name">{user.username}</p>
                    <p className="status">{user.status}</p>
                    <p className='xp'>{user.experience}XP</p>
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
                    <Search/>
                    <Add/>
                </div>
            </div>
        );

}

export default Home;

