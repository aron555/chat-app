import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SignInResponse, User } from './types';
import axios from 'axios';

export interface AuthState {
  user: User | null;
  isLogged: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogged: false,
};

const API_HOST = process.env.REACT_APP_API_HOST || 'http://chat.test';

export const signIn = createAsyncThunk<
  { message: string },
  { username: string; password: string },
  { rejectValue: { message: string } }
>('auth/signIn', async ({ username, password }, { rejectWithValue }) => {
  try {
    const signInResponse = await axios.post<SignInResponse>(API_HOST + '/api/auth/sign-in', {
      username,
      password,
    });

    const data = signInResponse.data.data;

    if (!data.jwt) throw new Error();

    localStorage.setItem('token', data.jwt);

    return { message: 'Logged in' };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to sign in' });
  }
});

export const signUp = createAsyncThunk<
  { message: string },
  { username: string; password: string },
  { rejectValue: { message: string } }
  >('auth/signUp', async ({ username, password }, { rejectWithValue }) => {
  try {
    const signInResponse = await axios.post<SignInResponse>(API_HOST + '/api/auth/sign-up', {
      username,
      password,
    });

    const data = signInResponse.data.data;

    if (!data.jwt) throw new Error();

    localStorage.setItem('token', data.jwt);

    return { message: 'Logged in' };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to sign up' });
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // restoreSessionWithJwt: (state, action: PayloadAction<{ token: string }>) => {
    //   console.log('restore session with jwt', action.payload.token);
    //
    //   // TODO: Fetch /me
    // },
    logout: (state) => {
      localStorage.removeItem('token');

      state.isLogged = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLogged = true;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLogged = false;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.isLogged = true;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLogged = false;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
