import { ReactNode } from "react";
import React, { ReactEventHandler } from 'react';
import './modal.css'
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import { useState } from "react";

import { useEffect } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  onClose: React.ReactEventHandler;
  Children:React.ReactNode;
};

const ModalContent = ({ onClose, Children }: ModalProps) => (
  <div className="overlay">
    <div className="modal">
      <div className="header-modal">
        Profil
        <button className="close-button-modal" onClick={onClose}>
          X
        </button>
      </div>
      {Children}
    </div>
  </div>
);

export default function Modal({ open, children, onClose }: { open: boolean; children: React.ReactNode; onClose: React.ReactEventHandler }) {
  const domNode = document.getElementById('portal');

  useEffect(() => {
    if (open && domNode) {
      const root = ReactDOM.createPortal(<>open && {<ModalContent onClose={onClose} Children={children}/>}</>, domNode);
    }
  }, [open, onClose, domNode]);

  return null;
}