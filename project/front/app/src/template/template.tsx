import React, { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";
import  '../App.css'
import Notification from "../components/notification/notification";
import { Outlet } from "react-router-dom";

interface Props {
    openModal: (param: boolean) => void;
    setContent: (param: ReactNode) => void;
}

const Template = ({openModal, setContent}:Props) => {

    return (
      <div className="page">
        <Notification message={"Nouveau Message"} channel={"sd"} isInChannel={false}/>
        <main className="main-template">
          <Outlet></Outlet>
        </main>
        <header>
            <Head openModal={openModal} setContent={setContent}/>
        </header>
        <footer>
            <Foot/>
        </footer>
      </div>
    );
  }

  export default Template
