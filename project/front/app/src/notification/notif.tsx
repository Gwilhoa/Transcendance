import { useState } from "react";
import { useEffect } from "react";
import './notific.css';

interface NotificationProps {
  message: string;
}

export default function Notification({ message }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000);

    return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
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

