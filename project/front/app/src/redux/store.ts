import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal/modalSlice';
import modalChatReducer from './chat/modalChatSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
	modalChat: modalChatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
