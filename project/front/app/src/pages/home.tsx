import './css/home.css'
import React, { useEffect, useState } from 'react';
import '../components/notification/notification.css'
import ErrorToken from '../components/IfError';

type Friend = {
    id: number;
    name: string;
    photo: string;
    numberVictory: number;
    numberDefeat: number;

};




// const Add = () => {
    // const [friendList, setFriendList] = useState<Friend[]>([]);
    // const addFriend = (newItem:Friend) => {
    //     setFriendList([...friendList, newItem]); 
    // }
    //     const [friendList, setFriendList] = useState<Friend[]>([]);
//     const addFriend = (newItem:Friend) => {
//         setFriendList([...friendList, newItem]); 
//     }
//     useEffect(() => {
//         addFriend({ name: "Pigie16", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 1 });
//         addFriend({ name: "Pigie17", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 9 });
//         addFriend({ name: "Pigie18", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 2 });
//         addFriend({ name: "Pigie19", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 3 });
//         addFriend({ name: "Pigie20", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 4 });
//     }, []);

//     return (
//         <div className="friend-list">

//         </dvi>
//     <div className="score-board">{blocks}</div>
//     );
// }

const Home = () => {
        return (
            <div className='home'>
				<ErrorToken />
                <div className="scrollBlock">

                    <div className="users-list">
                        <div className="user">
                            <img className='image' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img>
                            <p className="name">Friend1</p>
                            <p className="status">Status</p>
                            <p className='xp'>5000XP</p>
                        </div>


                    </div>

                    {/* <Add/> */}
                </div>
            </div>
        );

}
//<GetTokenUser url="http://localhost:3000/auth/login"/>

export default Home;

