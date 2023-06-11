import React, { useEffect, useState } from "react";
import Head from "./header";
import  '../App.css'
import Notification from "../components/notification/notification";
import { Outlet, useLocation } from "react-router-dom";
import { socket } from "../components/utils/API";



const Template = () => {
  let friendId = 0;
  const [notif, setNotif] = useState(<></>);
  
  //const location = useLocation();
  
  //useEffect(() => {
    //if (location.pathname === '/') {
      //  window.location.reload();
      //}
      //socket = io(process.env.REACT_APP_IP + ":3000", {
        //  transports: ['websocket']
        //});
        //}, []);
        
        const confirmFriend = () => {
          console.log("confirm friend")
          socket.emit('friend_request', {data: friendId})
        }
        
        const rejectFriend = () => {
          console.log("reject friend")
    }

    socket.on('message', (data:any) => {
      console.log(data)
    }) 
    socket.on('friend_request', (data: any) => {
      if (data.code == 4) {
        console.log(data);
        friendId = data.id;
        setNotif(<Notification message={"New friend"} onConfirm={confirmFriend} onCancel={rejectFriend} hasButton={true}/>);
			}
		})

    socket.on('challenge', (data:any) => {
      console.log(data);
    });
    
    
    return (
      <div className="page">
        {notif}
        <main className="main-template">
          <Outlet></Outlet>
        </main>
        <header>
            <Head/>
        </header>
      </div>
    );
  }

  export default Template
