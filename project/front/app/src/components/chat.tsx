import Template from "../template/template"
import './chat.css'

type message = {
    contain: string,
    author: string
}


const Chat = () => {
    return (
        <Template>
            <form className="input" >
                <input type="input" placeholder="Message à envoyer" className="input__box"></input>
                <button className="input__submit" type="submit">
                    Envoyer
                </button>
            </form>
        
        </Template>
    );
  }

  export default Chat