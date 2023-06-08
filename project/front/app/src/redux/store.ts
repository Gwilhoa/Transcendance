import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal/modalSlice';
import modalChatReducer from './chat/modalChatSlice';
import conversationIdReducer from './chat/conversationIdSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
	modalChat: modalChatReducer,
	conversation: conversationIdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
