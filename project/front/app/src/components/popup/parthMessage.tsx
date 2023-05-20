import { Message } from "../utils/API";
import CV from "../profil/CV";
import React, { ReactNode } from "react";


export function parthMessages (listMessageGet:Message[], chan:string, setIsOpen:(param: boolean) => void, setContent:(param: ReactNode) => void) {
    const messagesRet = [];
    
    const clickName = (i:number) => {
      setContent(<CV name={listMessageGet[i].author} isFriend={false} isMe={false} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"} closeModal={setIsOpen}/>);
      setIsOpen(true);
    }
    
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