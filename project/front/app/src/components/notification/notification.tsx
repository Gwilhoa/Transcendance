import React, { useState } from "react";
import { useEffect } from "react";
import './notification.css';
import { Link } from "react-router-dom";

interface NotificationProps {
  message: string;
  onConfirm: () => void;
  onCancel:  () => void;
  hasButton:boolean
}

export default function Notification({ message, onConfirm, onCancel, hasButton }: NotificationProps) {
  const [visible, setVisible] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 600000);

    return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
      setVisible(false);
    };

  if (visible) {
      return (
        <div className="notific" onClick={handleClose}>
          <h2>
            {message}
          </h2>
          
          {hasButton &&
            <>
            <button onClick={onConfirm}>
              <h2>
                <span role="img" aria-label="Valider">&#10004;</span>
              </h2>
            </button>
            <button onClick={onCancel}>
              <h2>
                <span role="img" aria-label="Refuser">&#10060;</span>
              </h2>
            </button>
            </>
          }  
          
        </div>
      );
  }
    else
        return null;
}

