import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal/modalSlice';
import modalChatReducer from './chat/modalChatSlice';
import conversationIdReducer from './chat/conversationIdSlice';
import finalGameStat from './game/gameSlice';
import searchReducer from './search/searchSlice';
import beginToOption from "./game/beginToOption";

const store = configureStore({
	reducer: {
		modal: modalReducer,
		modalChat: modalChatReducer,
		conversation: conversationIdReducer,
		finalGame: finalGameStat,
		searchUser: searchReducer,
		beginToOption: beginToOption,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
