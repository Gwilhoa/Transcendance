import React, { useState } from "react";
import { useEffect } from "react";
import './notification.css';
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
      setVisible(false);
    };

  if (visible) {
      return (
        <div className="not">
          <h2>
          </h2>
        </div>
      );
  }
    else
        return null;
}

