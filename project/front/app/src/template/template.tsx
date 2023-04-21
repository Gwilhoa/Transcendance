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
          <div className="form-container">
            <main>{props.children}</main>
          </div>
        <header>
            <Head/>
            <Notification channel="yo" message="Nouveau message"/> 
        </header>
        <footer>
            <Foot/>
        </footer>
      </div>
    );
  }

  export default Template