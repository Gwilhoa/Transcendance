import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ConversationState {
	id: string;
}

const initialState: ConversationState = {
	id: '',
};

const conversationIdSlice = createSlice({
	name: 'ConversationId',
	initialState,
	reducers: {
		setConversation: (state, action: PayloadAction<string>) => {
			state.id = action.payload;
			localStorage.setItem('conversationId', action.payload);
		},
	},
});

export const {setConversation} = conversationIdSlice.actions;

export default conversationIdSlice.reducer;
