import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
	isOpenSideBar: boolean;
	isOpenCreateChannel: boolean;
	isOpenInviteChannel: boolean;
}

const initialState: ModalState = {
	isOpenSideBar: false,
	isOpenCreateChannel: false,
	isOpenInviteChannel: false,
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
		switchChatModalInviteChannel: (state) => {
			state.isOpenInviteChannel = !state.isOpenInviteChannel;
		},

	},
});

export const
{
	switchChatModalSideBar, 
	switchChatModalCreateChannel, 
	switchChatModalInviteChannel,
} = modalChatSlice.actions;

export default modalChatSlice.reducer;
