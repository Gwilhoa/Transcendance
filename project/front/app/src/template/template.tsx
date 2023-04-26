import { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";
import Notification from "../notification/notif";
import  '../general.css'

type Props = {
    children: ReactNode;
};

const Template = (props: Props) => {

  //<Notification channel="yo" message="Nouveau message"/> 
    return (
      <div className="page">
        <header>
            <Head/>
        </header>
          
        <main className="main-template">{props.children}
        </main>

        <footer>
            <Foot/>
        </footer>
      </div>
    );
  }

  export default Template