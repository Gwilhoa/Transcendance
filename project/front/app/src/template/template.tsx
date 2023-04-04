import { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";

type Props = {
    children: ReactNode;
};

const Template = (props: Props) => {
    return (
      <div>
      <header>
            <Head/>
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