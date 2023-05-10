import { useState } from "react";
import { useEffect } from "react";
import './notific.css';
import { ChangeChannel} from "../popup/chatManager";
import { Link } from "react-router-dom";

interface NotificationProps {
  message: string;
  channel: string;
}

export default function Notification({ message, channel }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 600000);

    return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
      ChangeChannel(channel);
      setVisible(false);
    };

  if (visible) {
      return (
      <div className="not">
        <Link to={"/" + ChangeChannel(channel)} className="notific" onClick={handleClose}>
        {message}
        </Link>
      </div>
    );
    }
    else
        return null;
}

