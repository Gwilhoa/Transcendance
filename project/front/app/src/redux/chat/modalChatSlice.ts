import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
	isOpenSideBar: boolean;
	isOpenCreateChannel: boolean;
	isOpenInviteChannel: boolean;
	isOpenUpdateChannel: boolean;
	isOpenListUser: boolean;
}

const initialState: ModalState = {
	isOpenSideBar: false,
	isOpenCreateChannel: false,
	isOpenUpdateChannel: false,
	isOpenInviteChannel: false,
	isOpenListUser: false,
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
		switchChatModalUpdateChannel: (state) => {
			state.isOpenUpdateChannel = !state.isOpenUpdateChannel;
		},
		switchChatModalListUser: (state) => {
			state.isOpenListUser = !state.isOpenListUser;
		},
	},
});

export const
{
	switchChatModalSideBar, 
	switchChatModalCreateChannel, 
	switchChatModalInviteChannel,
	switchChatModalUpdateChannel,
	switchChatModalListUser,
} = modalChatSlice.actions;

export default modalChatSlice.reducer;
