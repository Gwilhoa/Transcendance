import { ReactNode } from "react";
import './modal.css'

interface Props {
    openModal: (param: boolean) => void;
    boolModal: boolean;
    content: ReactNode;
};

export default function Modal( {openModal, boolModal, content}:Props) {

    return (
            <>
             {boolModal && 
            <div className="overlay">
            <div className="modal">
                <div className="header-modal">
                    Profil
                    <button className="close-button-modal" onClick={() => openModal(false)}> X </button>
                </div>
                {content}
            </div>
        </div>}
            </>
        );
}