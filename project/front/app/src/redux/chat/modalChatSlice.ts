import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
	isOpen: boolean;
}

const initialState: ModalState = {
	isOpen: false,
};

const modalChatSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		switchChatModal: (state) => {
			state.isOpen = !state.isOpen;
		},
	},
});

export const { switchChatModal } = modalChatSlice.actions;

export default modalChatSlice.reducer;
