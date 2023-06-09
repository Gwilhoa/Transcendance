import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
	isOpenSideBar: boolean;
	isOpenCreateChannel: boolean;
}

const initialState: ModalState = {
	isOpenSideBar: false,
	isOpenCreateChannel: false,
};

const modalChatSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		switchChatModalSideBar: (state) => {
			state.isOpenSideBar = !state.isOpenSideBar;
		},
		switchChatModalCreateChannel: (state) => {
			state.isOpenCreateChannel = !state.isOpenCreateChannel;
		},

	},
});

export const { switchChatModalSideBar, switchChatModalCreateChannel } = modalChatSlice.actions;

export default modalChatSlice.reducer;
