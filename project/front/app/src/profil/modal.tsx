import { ReactNode } from "react";
import React, { ReactEventHandler } from 'react';
import './modal.css'
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import { useState } from "react";

export default function Modal( {open, children, onClose } : {open:boolean, children: ReactNode, onClose:  ReactEventHandler}) {
    
    const domNode = document.getElementById('portal');
    if (domNode !== null) {
        const root = createRoot(domNode);
        if (!open) {
            root.unmount();
            return null;
        }
        if (root !== null)  {
            root.render( 
              
        <div className="overlay">
            <div className="modal">
                <div className="header-modal">
                    Profil
                    <button className="close-button-modal" onClick={onClose}> X </button>
                </div>
                {children}
            </div>
        </div>);
        }
    }
    return null

}