import '../components/accueil.css'
import React, { useEffect, useState } from 'react';
import '../components/notification/notification.css'

type Friend = {
    id: number;
    name: string;
    photo: string;
    numberVictory: number;
    numberDefeat: number;

};

const Accueil = () => {

    const [friendList, setFriendList] = useState<Friend[]>([]);
    const addFriend = (newItem:Friend) => {
        setFriendList([...friendList, newItem]); 
    }

    useEffect(() => {
        addFriend({ name: "Pigie16", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 1 });
        addFriend({ name: "Pigie17", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 9 });
        addFriend({ name: "Pigie18", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 2 });
        addFriend({ name: "Pigie19", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 3 });
        addFriend({ name: "Pigie20", photo: "https://s1.qwant.com/thumbr/0x380/2/2/8df4854dfd8e4557c0248eb7b135e5a7f769adf0a914e608e5c43cabc772f1/grunge_communist_emblem_by_frankoko-d4iez6z.png?u=https%3A%2F%2Fimg00.deviantart.net%2F6037%2Fi%2F2011%2F341%2F2%2F7%2Fgrunge_communist_emblem_by_frankoko-d4iez6z.png&q=0&b=1&p=0&a=0", numberVictory: 5, numberDefeat: 7, id: 4 });
      }, []);

        return (
            <div className='accueil'>
                {friendList.map(item => (
                <li className="formFriend" key={item.id}>
                    <img className='circle-image' src={item.photo} alt="selected" />
                    <div className='colorTextFriend'>
                    {item.name}
                    </div>
              
                    {item.numberVictory}
                </li> 
                ))}
            </div>
        );

}
//<GetTokenUser url="http://localhost:3000/auth/login"/>

export default Accueil;
