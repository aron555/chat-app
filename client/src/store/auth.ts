import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_HOST, GetUserInfoByTokenResponse, SignInResponse, User } from './types';
import axios from 'axios';

export interface AuthState {
  user: User | null;
  isLogged: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogged: !!localStorage.getItem('token'),
};

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

    if (!data?.jwt) throw new Error();

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

    if (!data?.jwt) throw new Error();

    localStorage.setItem('token', data.jwt);

    return { message: 'Logged in' };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to sign up' });
  }
});

export const getUserInfoByToken = createAsyncThunk<
  { user: User },
  { token: string },
  { rejectValue: { message: string } }
>('auth/getUserInfoByToken', async ({ token }, { rejectWithValue }) => {
  try {
    const currentUser = await axios.get<GetUserInfoByTokenResponse>(API_HOST + '/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = currentUser.data.data;

    if (!data?.user) throw new Error();

    const user = data.user;

    return { user };
  } catch (error: any) {
    return rejectWithValue({ message: 'Failed to get current user info' });
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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

    builder.addCase(getUserInfoByToken.fulfilled, (state, action) => {
      state.isLogged = true;
      state.user = action.payload.user;
    });
    builder.addCase(getUserInfoByToken.rejected, (state, action) => {
      state.isLogged = false;
      alert('Failed to get current user info');
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
