import { ReactNode } from "react";
import Head from "./header";
import Foot from "./footer";
import React, { useState } from "react";

type Props = {
    children: ReactNode;
};
/*
export const [isClicked, setIsClicked] = useState<boolean>(false);

export const Clicked = () => {
    setIsClicked(true);
    const buttons = document.querySelectorAll("button:not(.clicked-button)");
    buttons.forEach((button) => button.classList.add("disabled-button"));
};*/

const Template = (props: Props) => {

    return (
      <div /*className={`page ${isClicked ? "page-overlay" : ""}`}*/>
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