import './notification.css';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NotificationProps {
  message: string;
  onConfirm: () => void;
  onCancel:  () => void;
  hasButton:boolean
  setVisible: (arg: boolean) => void;
}

export default function Notification({ message, onConfirm, onCancel, hasButton, setVisible }: NotificationProps) {
 
  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setVisible(false);
    // }, 3000);

    // return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
      setVisible(false);
    };

  
      return (
        <div className='popup-notification' onClick={handleClose}>
          <h2>
            {message}
          </h2>
          
          {hasButton &&
            <>
            <div className='notification-button-validate' onClick={onConfirm}></div>
            <div className='notification-button-cancel' onClick={onCancel}></div>
            </>
          }  
          
        </div>
      );
}

