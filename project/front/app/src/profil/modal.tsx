import { ReactNode } from "react";
import React, { ReactEventHandler } from 'react';
import './modal.css'

export default function Modal( {open, children, onClose } : {open:boolean, children: ReactNode, onClose:  ReactEventHandler}) {
    if (!open) return null

    return (
        <div className="overlay">
            <div className="modal">
                <div className="header-modal">
                    Profil
                    <button className="close-button-modal" onClick={onClose}> X </button>
                </div>
                {children}
            </div>
        </div>

    )
}