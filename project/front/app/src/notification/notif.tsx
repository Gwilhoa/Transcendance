import { useState } from "react";
import { useEffect } from "react";
import './notific.css';
import { ChangeChannel, JoinChat } from "../chatManager";

interface NotificationProps {
  message: string;
  channel: string;
}

export default function Notification({ message, channel }: NotificationProps) {
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
        <button onClick={handleClose} className="notific">
        
        {message}
      </button>
        </div>
    );
    }
    else
        return null;
}

