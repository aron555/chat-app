import { API_HOST, Chat, GetChatInfo, GetChatMessages, Message } from './types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ChatState {
  chat: Chat | null,
  messages: Message[] | null;
  isLoading: boolean;
}

const initialState: ChatState = {
  chat: null,
  messages: null,
  isLoading: false,
};

export const getChatInfo = createAsyncThunk<
  { chat: Chat },
  { token: string; chatId: string },
  { rejectValue: { message: string } }
  >('chats/getChatInfo', async ({ token, chatId }, { rejectWithValue }) => {
  try {
    const userChats = await axios.get<GetChatInfo>(API_HOST + `/api/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = userChats.data.data;

    if (!data?.chat) throw new Error();

    const chat = data.chat;

    return { chat };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to get chat info' });
  }
});

export const getChatMessages = createAsyncThunk<
  { messages: Message[] },
  { token: string; chatId: string },
  { rejectValue: { message: string } }
>('chats/getChatMessages', async ({ token, chatId }, { rejectWithValue }) => {
  try {
    const userChats = await axios.get<GetChatMessages>(API_HOST + `/api/chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = userChats.data.data;

    if (!data?.messages) throw new Error();

    const messages = data.messages;

    return { messages };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to get chat messages' });
  }
});

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChatInfo.pending, (state) => {
      state.chat = null;
      state.isLoading = true;
    });
    builder.addCase(getChatInfo.fulfilled, (state, action) => {
      state.chat = action.payload.chat;
      state.isLoading = false;
    });
    builder.addCase(getChatInfo.rejected, (state) => {
      state.messages = null;
      state.isLoading = false;
    });

    builder.addCase(getChatMessages.pending, (state) => {
      state.messages = null;
      state.isLoading = true;
    });
    builder.addCase(getChatMessages.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
      state.isLoading = false;
    });
    builder.addCase(getChatMessages.rejected, (state) => {
      state.messages = null;
      state.isLoading = false;
    });
  },
});

export default chatSlice.reducer;
