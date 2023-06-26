import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IdState {
	id: string | null;
}

const initialState: IdState = {
	id: null,
};

const conversationIdSlice = createSlice({
	name: 'id',
	initialState,
	reducers: {
		setConversationId: (state, action: PayloadAction<string | null>) => {
			state.id = action.payload;
		},
	},
});

export const {setConversationId} = conversationIdSlice.actions;

export default conversationIdSlice.reducer;
