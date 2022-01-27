import { API_HOST, Chat, ChatState, GetUserChatsResponse } from './types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ChatsState {
  chats: ChatState[] | null;
  isLoading: boolean;
}

const initialState: ChatsState = {
  chats: null,
  isLoading: false,
};

export const getUserChatsByToken = createAsyncThunk<
  { chats: Chat[] },
  { token: string },
  { rejectValue: { message: string } }
>('chats/getUserChats', async ({ token }, { rejectWithValue }) => {
  try {
    const userChats = await axios.get<GetUserChatsResponse>(API_HOST + '/api/users/me/chats', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = userChats.data.data;

    if (!data?.chats) throw new Error();

    const chats = data.chats;

    return { chats };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to get current user info' });
  }
});

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    incrementChatUnreadMessagesCounter(state, action: PayloadAction<{ chatId: string }>) {
      if (!state.chats) return;

      const index = state.chats.findIndex((chat) => chat.id === action.payload.chatId);

      if (state.chats[index].unreadMessagesCount) {
        // @ts-ignore
        state.chats[index].unreadMessagesCount++;
      } else {
        state.chats[index].unreadMessagesCount = 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserChatsByToken.pending, (state) => {
      state.chats = null;
      state.isLoading = true;
    });
    builder.addCase(getUserChatsByToken.fulfilled, (state, action) => {
      state.chats = action.payload.chats;
      state.isLoading = false;
    });
    builder.addCase(getUserChatsByToken.rejected, (state) => {
      state.chats = null;
      state.isLoading = false;
    });
  },
});

export default chatsSlice.reducer;

export const { incrementChatUnreadMessagesCounter } = chatsSlice.actions;
