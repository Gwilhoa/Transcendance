import { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";
import Notification from "../notification/notif";

type Props = {
    children: ReactNode;
};

const Template = (props: Props) => {

    return (
      <div>
        <header>
            <Head/>
            <Notification message="Nouveau message"/> 
        </header>
          <div className="form-container">
            <main>{props.children}</main>
          </div>
        <footer>
            <Foot/>
        </footer>
      </div>
    );
  }

  export default Template