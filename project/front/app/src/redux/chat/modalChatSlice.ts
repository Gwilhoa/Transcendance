import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
	isOpenSideBar: boolean;
	isOpenCreateChannel: boolean;
	isOpenInviteChannel: boolean;
	isOpenUpdateChannel: boolean;
}

const initialState: ModalState = {
	isOpenSideBar: false,
	isOpenCreateChannel: false,
	isOpenUpdateChannel: false,
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
		switchChatModalUpdateChannel: (state) => {
			state.isOpenUpdateChannel = !state.isOpenUpdateChannel;
		}
	},
});

export const
{
	switchChatModalSideBar, 
	switchChatModalCreateChannel, 
	switchChatModalInviteChannel,
	switchChatModalUpdateChannel
} = modalChatSlice.actions;

export default modalChatSlice.reducer;
