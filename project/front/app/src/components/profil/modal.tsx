import './profil.css'
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Profil from './profil';

export default function ProfilModal() {
	const isOpen = useSelector((state: RootState) => state.modal.isOpen);

	return (
		<>
			{isOpen &&
                <div className='page-shadow'>
                    <Profil/>
                </div>}
		</>
	);
}
