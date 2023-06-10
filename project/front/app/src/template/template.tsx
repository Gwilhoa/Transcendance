import React, { useEffect } from "react";
import Head from "./header";
import  '../App.css'
import Notification from "../components/notification/notification";
import { Outlet, useLocation } from "react-router-dom";
import { socket } from "../components/utils/API";



const Template = () => {

  const location = useLocation();

  //useEffect(() => {
    //if (location.pathname === '/') {
    //  window.location.reload();
    //}
    //socket = io(process.env.REACT_APP_IP + ":3000", {
    //  transports: ['websocket']
    //});
  //}, []);


    return (
      <div className="page">
        <Notification message={"Nouveau Message"} channel={"sd"} isInChannel={false}/>
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
