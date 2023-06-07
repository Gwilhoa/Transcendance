import React from "react";
import Head from "./header";
import  '../App.css'
import Notification from "../components/notification/notification";
import { Outlet } from "react-router-dom";

const Template = () => {

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
