import {API_HOST, GetChatMessages, Message} from './types.d';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ChatState {
  messages: Message[] | null;
  isLoading: boolean;
}

const initialState: ChatState = {
  messages: null,
  isLoading: false,
};

export const getChatMessages = createAsyncThunk<
  { messages: Message[] },
  { token: string, chatId: string },
  { rejectValue: { message: string } }
  >('chats/getUserChats', async ({ token, chatId }, { rejectWithValue }) => {
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
