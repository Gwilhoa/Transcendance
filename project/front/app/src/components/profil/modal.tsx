import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from '../../redux/modal/modalSlice';
import { RootState } from "../../redux/store";
import CV from "./CV";
import './modal.css'

export default function Modal() {
	const dispatch = useDispatch();
	const isOpen = useSelector((state: RootState) => state.modal.isOpen);

	const handleCloseModal = () => {
		dispatch(closeModal());
	};

    return (
            <>
             {isOpen && 
            <div className="overlay">
            <div className="modal">
                <div className="header-modal">
                    Profil
                    <button className="close-button-modal" onClick={() => handleCloseModal()}> X </button>
                </div>
                <CV/>
            </div>
        </div>}
            </>
        );
}
