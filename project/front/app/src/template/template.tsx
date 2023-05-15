import { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";
import  '../general.css'
import Notification from "../notification/notif";
import { Outlet } from "react-router-dom";

interface Props {
    openModal: (param: boolean) => void;
    setContent: (param: ReactNode) => void;
}

const Template = ({openModal, setContent}:Props) => {

    return (
      <div className="page">
        <header>
            <Head openModal={openModal} setContent={setContent}/>
        </header>
          <Notification message={"ds"} channel={"sd"}/>
        <main className="main-template">
          <Outlet></Outlet>
        </main>

        <footer>
            <Foot/>
        </footer>
      </div>
    );
  }

  export default Template