import { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";
import  '../general.css'

interface Props {
    openModal: (param: boolean) => void;
    child: () => ReactNode;
    setContent: (param: ReactNode) => void;
};

const Template = ({openModal, setContent, child}:Props) => {

    return (
      <div className="page">
        <header>
            <Head openModal={openModal} setContent={setContent}/>
        </header>
          
        <main className="main-template">{child()}
        </main>

        <footer>
            <Foot/>
        </footer>
      </div>
    );
  }

  export default Template