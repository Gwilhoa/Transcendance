import { useState } from "react";
import { useEffect } from "react";
import './notific.css';
import { ChangeChannel} from "../popup/chatManager";
import { Link } from "react-router-dom";

interface NotificationProps {
  message: string;
  channel: string;
  isInChannel: boolean;
}

export default function Notification({ message, isInChannel, channel }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000);

    return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
      ChangeChannel(channel);
      setVisible(false);
    };

  if (visible) {
      return (
        <div className="not">
          <h2>
            {isInChannel} &&
          <Link to={"/" + ChangeChannel(channel)} className="notific" onClick={handleClose}>
            {message}
          </Link>
            {!isInChannel} &&
          <Link to={"/game"} className="notific" onClick={handleClose}>
            {message}
          </Link>
          </h2>
        </div>
      );
  }
    else
        return null;
}

