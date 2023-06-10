import './css/home.css'
import React, { useCallback, useEffect, useState } from 'react';
import '../components/notification/notification.css'
import ErrorToken, { setErrorLocalStorage } from '../components/IfError';
import { Navigate, useNavigate } from 'react-router-dom';
import axios, { socket } from '../components/utils/API';
import { cookies } from '../App';
import { IUser } from '../components/utils/interface';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../redux/store";
import { setUsers, addUser, setUsersNull } from '../redux/search/searchSlice';
import { openModal } from "../redux/modal/modalSlice";


export const Search = ({ defaultAllUsers }: { defaultAllUsers: boolean }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const id = localStorage.getItem('id');

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const res = event.target.value;
        if (res.length === 0 && defaultAllUsers === false) {
            dispatch(setUsersNull());
            console.log('handleOnChange null');
        }
        else {
            console.log('handleOnChange');
            console.log('emit: ' + res);
            socket.emit('research_name', {name: res});
        }
    };
    
    useEffect(() => {
        socket.on('research_name', (data: any) => {
            const UsersWithoutYou = data.filter((user: IUser) => user.id !== id);
            dispatch(setUsers(UsersWithoutYou));
            console.log('research_name');
            console.log(data);
        });

        socket.on('new_user', (data: IUser) => {
            console.log(data);
            dispatch(addUser(data));
        });
    }, [navigate, dispatch, socket]);
    
        return (
        <input type='search' placeholder='Search' className='search-bar' onChange={handleOnChange}></input>
    );
}

const Add = () => {
    const [listUser, setListUser] = useState<Array<IUser> | null >([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    console.log('Add');
    const searchUser = (useSelector((state: RootState) => state.searchUser.users));
    useEffect(() => {
        setListUser(searchUser);
    },[searchUser]);

    console.log(listUser?.length);
    if (listUser == null)
        console.log('listUser null');
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


    useEffect(() => {
        if (listUser == null)
        {
            refresh();
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
        }
    }, [listUser, refresh, socket]);
    







    if (listUser == null || listUser.length == 0)
    {
        return (<p className="no-friend">Knowing how to enjoy your own company is an art. <span>Natasha Adamo</span></p>);
    }
    console.log(listUser);
    return (
        <div className="users-list">
            {listUser.map((user) => (
                <div className="user" key={user.id} onClick={() => dispatch(openModal(user.id))}>
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
                    <Search defaultAllUsers={false}/>
                    <Add/>
                </div>
            </div>
        );

}

export default Home;

