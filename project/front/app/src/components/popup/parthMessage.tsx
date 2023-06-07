import { Message } from "../utils/API";
import CV from "../profil/CV";
import React, { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/modal/modalSlice";


export function parthMessages ( listMessageGet:Message[], chan:string ) {
    const messagesRet = [];
    
    // const clickName = (i:number) => {
    //   setContent(<CV id={i.toString()} closeModal={setIsOpen}/>);
    //   setIsOpen(true);
    // }


	const clickName = (id: number) => {
		console.log(id);
	};

    for(let i = 0; i < listMessageGet.length; i++) {
      
      if (listMessageGet[i].author === "") {
        messagesRet.push(
          <li className="message me" key={i}>
            {listMessageGet[i].contain}
          </li>
        )
      }
      
      else {
        messagesRet.push(
          <li key={i}>
              {"de : "}
              <a  onClick={() => clickName(i)} className=""> 
                {listMessageGet[i].author}
              </a>
              <div className="message other">
                {listMessageGet[i].contain}
              </div>
          </li>
        )
      }
    }
    return <div className="messagePannel"> {messagesRet} </div>;
  }
