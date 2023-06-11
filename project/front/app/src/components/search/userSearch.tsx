import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/API';
import { IUser } from '../utils/interface';
import { useDispatch } from 'react-redux';
import { setUsers, addUser, setUsersNull } from '../../redux/search/searchSlice';

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