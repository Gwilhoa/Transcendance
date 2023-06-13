import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
	decide:boolean;
    playerstate:number;

}

const initialState: GameState = {
    decide:false,
    playerstate:0,
};

const beginGameSlice = createSlice({
	name: 'begingame',
	initialState,
	reducers: {
		setBeginStatus: (state, action: PayloadAction<any>) => {
			state.decide = action.payload.playerstate;
            state.playerstate = action.payload.playerstate; 
		},
	},
});

export const { setBeginStatus } = beginGameSlice.actions;

export default beginGameSlice.reducer;