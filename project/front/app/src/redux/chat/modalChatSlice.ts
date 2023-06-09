import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
	isOpenSideBar: boolean;
	isOpenCreatechannel: boolean;
}

const initialState: ModalState = {
	isOpenSideBar: false,
	isOpenCreatechannel: false,
};

const modalChatSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		switchChatModalSideBar: (state) => {
			state.isOpenSideBar = !state.isOpenSideBar;
		},
		switchChatModalCreateChannel: (state) => {
			state.isOpenCreatechannel = !state.isOpenCreatechannel;
		},

	},
});

export const { switchChatModalSideBar } = modalChatSlice.actions;

export default modalChatSlice.reducer;
